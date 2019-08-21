import {XingxingScooterStore} from "../../stores/XingxingScooterStore";
require('react-native/Libraries/Core/setUpXHR');

describe('XingxingScooterStore', () => {
    let store: XingxingScooterStore = null;

    beforeAll(() => {
        store = new XingxingScooterStore();
    });

    it('should fetch well', async () => {
        const isSuccess = await store.fetch(37.500978895323335, 127.05120764727658, 18);
        expect(isSuccess).toBe(true);
    });
});
