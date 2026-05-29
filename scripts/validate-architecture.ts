import * as fs from 'fs';
import * as path from 'path';

// Determinar la raíz real del monorepo
const MONOREPO_ROOT = path.resolve(__dirname, '..');

const BACKEND_SRC = path.join(MONOREPO_ROOT, 'apps', 'backend', 'src');
const FRONTEND_SRC = path.join(MONOREPO_ROOT, 'apps', 'web', 'src');

// Localizar dinámicamente todos los directorios llamados 'domain' en el monorepo
// Esto soporta de forma nativa arquitecturas por capas y Slices Verticales
function locateDomainDirectories(baseDir: string): string[] {
    const domainDirs: string[] = [];
    if (!fs.existsSync(baseDir)) return domainDirs;

    const items = fs.readdirSync(baseDir);
    for (const item of items) {
        const fullPath = path.join(baseDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (item === 'domain') {
                domainDirs.push(fullPath);
            } else {
                domainDirs.push(...locateDomainDirectories(fullPath));
            }
        }
    }
    return domainDirs;
}

function auditDomainFile(filePath: string): boolean {
    const content = fs.readFileSync(filePath, 'utf8');
    let hasViolation = false;

    // Vector 1: Intercepción de comentarios de sabotaje (Inline Disables)
    if (content.includes('eslint-disable')) {
        console.error(`CRITICAL SECURITY VIOLATION: Inline linter bypass detected in: ${filePath}`);
        hasViolation = true;
    }

    // Vector 2: Análisis de líneas de importación (Lista Blanca Estricta)
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('import ') || line.trim().startsWith('import(')) {
            // El dominio solo puede importar de rutas relativas internas o declaraciones de tipos puros
            const isRelativeImport = line.includes("from './") || line.includes("from '../");
            const isTypeOnly = line.trim().startsWith('import type');
            
            if (!isRelativeImport && !isTypeOnly) {
                console.error(`CRITICAL ARCHITECTURAL VIOLATION: Illegal external or cross-layer import detected in: ${filePath}`);
                console.error(`Offending line: ${line.trim()}`);
                hasViolation = true;
            }
        }
    }

    return hasViolation;
}

function scanDirectory(dir: string): boolean {
    let violationFound = false;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (scanDirectory(fullPath)) violationFound = true;
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            if (auditDomainFile(fullPath)) violationFound = true;
        }
    }
    return violationFound;
}

console.log('Executing Unified Dynamic Hard Policy Gate Check...');

// Recolección dinámica de objetivos de dominio
const backendDomains = locateDomainDirectories(BACKEND_SRC);
const frontendDomains = locateDomainDirectories(FRONTEND_SRC);
const allDomains = [...backendDomains, ...frontendDomains];

if (allDomains.length === 0) {
    console.error('Error: No "domain" directories discovered in the entire monorepo.');
    process.exit(1);
}

let globalFailure = false;

// Auditar uno a uno todos los dominios encontrados de forma agnóstica a la topología
for (const domainPath of allDomains) {
    console.log(`Auditing target domain directory: ${domainPath}`);
    if (scanDirectory(domainPath)) {
        globalFailure = true;
    }
}

if (globalFailure) {
    console.error('\nPolicy Gate Status: REJECTED. Halting build execution due to architectural non-compliance.');
    process.exit(1);
} else {
    console.log('\nPolicy Gate Status: PASSED. All discovered domain layers remain pure.');
    process.exit(0);
}