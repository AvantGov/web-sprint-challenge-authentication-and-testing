const supertest = require("supertest")
const server = require("../api/server")
const database_access = require("../database/dbConfig")


const newUser = {
    username: "3jj43lw",
    password: "43wsld02ed4o4"
}

const currentUser = {
    username: "1qkaT7KkgGP$",
    password: "*qZypC^t#5fh"
}

describe("integration testing for registration", () => {
    afterAll(async () => {
        await database_access.destroy()
    })

    it("POST /registration with new user", async () => {
        const res = await supertest(server)
            .post("/api/auth/register")
            .send(newUser)

        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.username).toBe("3jj43lw")
    })

    it("POST /register with existing user", async () => {
        const res = await supertest(server)
            .post("/register")
            .send(currentUser)
        expect(res.statusCode).toBe(409)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("user already exists")
    })
})