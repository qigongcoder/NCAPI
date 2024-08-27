const request = require('supertest');
const app = require("../app");

const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(()=>seed(data));
afterAll(()=>db.end());

describe("/api/topics",()=>{
    test("Tests that this endpoint responds with all topics. It should reply with an array of topic object, each with the properties slug and description", () =>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response)=>{
            const {body}= response;
            expect(body).toHaveProperty("topics");
            expect(Array.isArray(body.topics)).toBe(true);
        })
    })
})
