import {KickgoingScooterStore} from "../../stores/KickgoingScooterStore";
require('react-native/Libraries/Core/setUpXHR');

describe('KickgoingScooterStore', () => {
    let store: KickgoingScooterStore = null;

    beforeAll(() => {
        store = new KickgoingScooterStore();
    });

    it('should fetch well', async () => {
        const isSuccess = await store.fetch(37.500978895323335, 127.05120764727658, 18);
        expect(isSuccess).toBe(true);
    });
});
