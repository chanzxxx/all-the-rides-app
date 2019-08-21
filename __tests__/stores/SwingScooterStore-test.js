import {SwingScooterStore} from "../../stores/SwingScooterStore";
require('react-native/Libraries/Core/setUpXHR');

describe('SwingScooterStore', () => {
    let store: SwingScooterStore = null;

    beforeAll(() => {
        store = new SwingScooterStore();
    });

    it('should fetch well', async () => {
        const isSuccess = await store.fetch(37.500978895323335, 127.05120764727658, 18);
        expect(isSuccess).toBe(true);
    });
});
