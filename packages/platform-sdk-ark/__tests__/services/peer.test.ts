import nock from "nock";

import { PeerService } from "../../src/services/peer";
import { dummyPeersPublicApi, dummyPeersWalletApi } from "./mocks/peers";
import { createConfig } from "../helpers";

beforeEach(() => {
	nock.cleanAll();

	nock("http://127.0.0.1")
		.get("/api/node/configuration")
		.reply(200, require("../__fixtures__/client/configuration.json"))
		.persist();
});

describe("PeerService", () => {
	describe("#new", () => {
		describe("host", () => {
			it("should throw if the peer is on the wrong network", async () => {
				await expect(
					PeerService.construct(
						createConfig({
							network: "mainnet",
							peer: "http://127.0.0.1/api",
						}),
					),
				).rejects.toThrowError("Failed to connect to http://127.0.0.1/api because it is on another network.");
			});

			it("should fetch peers", async () => {
				nock("http://127.0.0.1").get("/api/peers").reply(200, {
					data: dummyPeersWalletApi,
				});

				const peerService: PeerService = await PeerService.construct(
					createConfig({
						peer: "http://127.0.0.1/api",
					}),
				);

				expect(peerService.getSeeds()).toEqual(dummyPeersWalletApi.map((peer) => `http://${peer.ip}:4103`));
			});

			it("should fetch peers and fallback to public api port", async () => {
				nock("http://127.0.0.1").get("/api/peers").reply(200, {
					data: dummyPeersPublicApi,
				});

				const peerService: PeerService = await PeerService.construct(
					createConfig({
						peer: "http://127.0.0.1/api",
					}),
				);

				expect(peerService.getSeeds()).toEqual(dummyPeersPublicApi.map((peer) => `http://${peer.ip}:4103`));
			});

			it("should fail if the seed list is empty", async () => {
				nock("http://127.0.0.1").get("/api/peers").reply(200, {
					data: [],
				});

				await expect(
					PeerService.construct(
						createConfig({
							peer: "http://127.0.0.1/api",
						}),
					),
				).rejects.toThrowError(new Error("No seeds found"));
			});
		});
	});

	describe("#search", () => {
		let peerService: PeerService;
		beforeEach(async () => {
			nock("http://127.0.0.1").get("/api/peers").reply(200, {
				data: dummyPeersWalletApi,
			});

			peerService = await PeerService.construct(createConfig({ peer: "http://127.0.0.1/api" }));
		});

		it("should find peers", async () => {
			nock(/.+/).get("/api/peers").reply(200, {
				data: dummyPeersWalletApi,
			});

			await expect(peerService.search()).resolves.toEqual(dummyPeersWalletApi);
		});

		it("should filter by version", async () => {
			nock(/.+/).get("/api/peers").twice().reply(200, {
				data: dummyPeersWalletApi,
			});

			await expect(peerService.search({ filters: { version: "2.6.0" } })).resolves.toEqual([
				dummyPeersWalletApi[1],
			]);

			await expect(peerService.search({ filters: { version: ">=2.5.0" } })).resolves.toEqual(dummyPeersWalletApi);
		});

		it("should filter by latency", async () => {
			nock(/.+/).get("/api/peers").twice().reply(200, {
				data: dummyPeersWalletApi,
			});

			await expect(peerService.search({ filters: { latency: 150 } })).resolves.toEqual([dummyPeersWalletApi[1]]);

			await expect(peerService.search({ filters: { latency: 250 } })).resolves.toEqual(dummyPeersWalletApi);
		});

		it("should sort by latency asc", async () => {
			nock(/.+/).get("/api/peers").reply(200, {
				data: dummyPeersWalletApi,
			});

			await expect(peerService.search({ orderBy: ["latency", "asc"] })).resolves.toEqual([
				dummyPeersWalletApi[1],
				dummyPeersWalletApi[0],
			]);
		});

		it("should sort by version desc", async () => {
			nock(/.+/).get("/api/peers").reply(200, {
				data: dummyPeersWalletApi,
			});

			await expect(peerService.search({ orderBy: ["version", "desc"] })).resolves.toEqual([
				dummyPeersWalletApi[1],
				dummyPeersWalletApi[0],
			]);
		});
	});
});
