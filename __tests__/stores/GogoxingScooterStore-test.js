import {GogoxingScooterStore} from "../../stores/GogoxingScooterStore";
require('react-native/Libraries/Core/setUpXHR');

describe('GogoxingScooterStore', () => {
    let store: GogoxingScooterStore = null;

    beforeAll(() => {
        store = new GogoxingScooterStore();
    });

    it('should fetch well', async () => {
        const isSuccess = await store.fetch(37.500978895323335, 127.05120764727658, 37.50328458960789, 127.05319968628298);
        expect(isSuccess).toBe(true);
    });
});
