
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Monster {
    name: string;
    description: string;
}

const testMonster: Monster = {
    name: "Draculaura",
    description: "Daughter of Dracula"
};

console.log(`✅ TypeScript setup working!`);
console.log(`Created monster: ${testMonster.name}`);

async function checks() {
    console.log("Checking library imports...");
    try {
        // Just checking if we can reference them without type errors
        const _a = axios.create();
        const _$ = cheerio.load('<h2 class="title">Hello world</h2>');
        console.log(`Cheerio loaded: ${_$('h2').text()}`);
    } catch (e) {
        console.error(e);
    }
}

checks();
