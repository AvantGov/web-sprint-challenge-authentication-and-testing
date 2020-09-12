const supertest = require("supertest")
const server = require("../api/server")
const database_access = require("../database/dbConfig")


const validUser = {
    username: "1qkaT7KkgGP$",
    password: "*qZypC^t#5fh"
}

const invalidUser = {
    username: "username",
    pasword: "password"
}


describe("integration testing for login", () => {
    afterAll(async () => {
        await database_access.destroy()
    })

    it("POST /login with valid credentials", async () => {
        const res = await supertest(server)
            .post("/api/auth/login")
            .send(validUser)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toContain("welcome")
    })

    it("POST /login with invalid credentials", async () => {
        const res = await supertest(server)
            .post("/api/auth/login")
            .send(invalidUser)
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toContain("invalid")
    })
    
})