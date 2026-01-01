
describe('Basic Test Setup', () => {
    test('should add two numbers correctly', () => {
        const a = 1;
        const b = 2;
        expect(a + b).toBe(3);
    });

    test('should support TypeScript types', () => {
        interface Hero {
            name: string;
            powerLevel: number;
        }

        const hero: Hero = {
            name: "Frankie Stein",
            powerLevel: 9000
        };

        expect(hero.name).toBe("Frankie Stein");
        expect(hero.powerLevel).toBeGreaterThan(100);
    });
});
