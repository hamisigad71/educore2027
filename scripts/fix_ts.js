import fs from 'fs';
import path from 'path';

const logFile = path.resolve('tsc_errors.log');
const errors = fs.readFileSync(logFile, 'utf-8');

const filesToFix = new Set();
for (const line of errors.split('\n')) {
    const match = line.match(/^([^(]+)\(\d+,\d+\):/);
    if (match) {
        filesToFix.add(match[1].trim());
    }
}

for (const f of filesToFix) {
    const absolutePath = path.resolve(f);
    if (!fs.existsSync(absolutePath)) {
        console.log(`Could not find ${absolutePath}`);
        continue;
    }

    let content = fs.readFileSync(absolutePath, 'utf-8');

    // Fix 1: onValueChange
    content = content.replace(/onValueChange=\{set([A-Za-z0-9_]+)\}/g, 'onValueChange={(val) => val && set$1(val)}');

    // Fix 2: asChild -> render
    content = content.replace(/<DialogClose([^>]*)asChild([^>]*)>/g, '<DialogClose$1render={<button />}$2>');
    content = content.replace(/<DropdownMenuLabel([^>]*)asChild([^>]*)>/g, '<DropdownMenuLabel$1render={<span />}$2>'); // Common pattern
    content = content.replace(/<([A-Za-z0-9_]+)([^>]*)asChild([^>]*)>/g, '<$1$2render={<div />}$3>');
    content = content.replace(/asChild=\{true\}/g, 'render={<div />}');
    content = content.replace(/asChild\n/g, 'render={<div />}\n');
    content = content.replace(/asChild\s*>/g, 'render={<div />}>');

    // Fix 3: unused imports
    content = content.replace(/import React(?:, \{.*?\})? from ['"]react['"];?\n?/g, '');

    const fileErrors = errors.split('\n').filter(l => l.startsWith(f));
    const unusedVars = new Set();
    for (const err of fileErrors) {
        const match = err.match(/error TS6133: '([^']+)' is declared but its value is never read./);
        if (match) unusedVars.add(match[1]);
    }

    for (const unused of unusedVars) {
        if (unused === 'React') continue;
        const re1 = new RegExp(`\\b${unused}\\s*,\\s*`, 'g');
        content = content.replace(re1, '');
        const re2 = new RegExp(`\\s*,\\s*\\b${unused}\\b`, 'g');
        content = content.replace(re2, '');
        const re3 = new RegExp(`{\\s*\\b${unused}\\b\\s*}`, 'g');
        content = content.replace(re3, '{}');
    }

    content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\n?/g, '');

    fs.writeFileSync(absolutePath, content, 'utf-8');
}

console.log(`Fixes applied to ${filesToFix.size} files in place.`);
