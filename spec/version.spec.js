const version = require('../src/version');
const fs = require("fs").promises;

describe(" get version info ", () => {
    const req = { };
    const res = { send: jest.fn() };
    let sha="";

    beforeAll(async () => {
        sha = await fs.readFile("metadata","utf8");
    })

    it('should return sha from metadata', async () => {
        const newShaValue = "a_new_sha_value";
        await fs.writeFile("metadata", newShaValue,"utf-8");
        await version.getVersionData(req, res);
        const respData = res.send.mock.calls[0][0];
        expect(respData.sha).toEqual(newShaValue);
    });

    it('should return version from package.json', async () => {
        const pkgVersion = process.env.npm_package_version;
        await version.getVersionData(req, res);
        const respData = res.send.mock.calls[0][0];
        expect(respData.version).toEqual(pkgVersion);
    });

    it('should return description from package.json', async () => {
        const pkgDescription = process.env.npm_package_description;
        await version.getVersionData(req, res);
        const respData = res.send.mock.calls[0][0];
        expect(respData.description).toEqual(pkgDescription);
    });

    afterAll(async () => {
        await fs.writeFile("metadata", sha,"utf-8");
    })
})
