import "jest-extended";

import { Utils } from "@arkecosystem/platform-sdk";

import { WalletData } from "../../src/dto/wallet";
import Fixture from "../__fixtures__/client/wallet.json";

describe("WalletData", function () {
	it("should succeed", async () => {
		const result = new WalletData(Fixture.result.value);

		expect(result).toBeInstanceOf(WalletData);
		expect(result.address()).toBe("cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		expect(result.publicKey()).toBe("Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
		expect(result.balance()).toEqual(Utils.BigNumber.make(69519574));
		expect(result.nonce()).toEqual(Utils.BigNumber.make(24242));
	});
});