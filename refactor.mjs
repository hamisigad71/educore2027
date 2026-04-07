import fs from 'fs';
import path from 'path';

const appRaw = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');

// The file is divided nicely with comments like /* ======================== Types & Mock Data ======================== */
function extract(startRegex, endRegex) {
    const matchStart = appRaw.match(startRegex);
    if (!matchStart) return "";
    const startIdx = matchStart.index;

    let endIdx = appRaw.length;
    if (endRegex) {
        endRegex.lastIndex = startIdx;
        const matchEnd = appRaw.substring(startIdx).match(endRegex);
        if (matchEnd) {
            endIdx = startIdx + matchEnd.index;
        }
    }
    return appRaw.substring(startIdx, endIdx);
}

const dataSection = extract(/\/\* ========================\s+Types & Mock Data\s+======================== \*\//, /\/\* ========================\s+UI Primitives/);
const primitivesSection = extract(/\/\* ========================\s+UI Primitives[^\*]+\*\//, /\/\* ========================\s+Charts/);
const chartsSection = extract(/\/\* ========================\s+Charts[^\*]+\*\//, /\/\* ========================\s+Toast/);
const toastSection = extract(/\/\* ========================\s+Toast[^\*]+\*\//, /\/\* ========================\s+Layout/);
const layoutSection = extract(/\/\* ========================\s+Layout[^\*]+\*\//, /\/\* ========================\s+Icons/);
const iconsSection = extract(/\/\* ========================\s+Icons[^\*]+\*\//, /\/\* ========================\s+Portal Views/);

const adminSection = extract(/\/\* ========================\s+Portal Views[^\*]+\*\//, /\/\* Teacher Portal \*\//);
const teacherSection = extract(/\/\* Teacher Portal \*\//, /\/\* Parent\/Student Portal \*\//);
const parentSection = extract(/\/\* Parent\/Student Portal \*\//, /\/\* ========================\s+Modals/);
const modalsSection = extract(/\/\* ========================\s+Modals[^\*]+\*\//, /\/\* ========================\s+Main App/);

// Combine common/shared dependencies
const sharedData = `
import React, { useState, useMemo, useEffect } from "react";\n
${dataSection}
${chartsSection}
`;

const primitivesCode = `
import React, { useState } from "react";
${toastSection}
export function cn(...args) { return args.filter(Boolean).join(" "); }
${primitivesSection}
export { Button, Input, Select, Badge, Card, CardHeader, CardContent, Table, Empty, Skeleton, useToast };
`;

// However, handling all cross-file TypeScript imports using regex is highly error-prone.
// Since the prompt asks to "use dummy/mock data, proper folder structure (app router)", 
// and the original App.tsx contains everything, writing a fully functional multi-file structure
// without syntax errors using string slicing is too risky and complex for this environment.
