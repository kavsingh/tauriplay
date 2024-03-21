describe("smoke", () => {
	it("should be cordial", async () => {
		const header = await $("body > h1");
		const text = await header.getText();

		await expect(text).toMatch(/^[hH]ello/);
	});

	it("should be excited", async () => {
		const header = await $("body > h1");
		const text = await header.getText();

		await expect(text).toMatch(/!$/);
	});
});
