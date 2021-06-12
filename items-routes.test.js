process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require('./app');
let items = require("./fakeDb");

let pickles = {name: "pickles", price: "2.75"}

beforeEach(function(){
    items.push(pickles);
});

afterEach(function(){
    items.length = 0;
});

describe("GET /items", function(){
    test("Gets a list of items in db", async function(){
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({items: [pickles]})

        expect(items.length).toEqual(1);
    });
});

describe("GET /items/:name", function(){
    test("gets a single item", async function(){
        const resp = await request(app).get(`/items/${pickles.name}`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({ item: pickles})
    });

    test("responds with 404 if item not in db", async function(){
        const resp = await request(app).get('/items/chicken');
        expect(resp.statusCode).toBe(404);
    });

});

describe("PATCH /items/:name", function(){
    test("updates an item", async function(){
        const resp = await request(app)
        .patch(`/items/${pickles.name}`)
        .send({
             name: "chicken", price: "3.00"
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
           updated:{item: {name: "chicken", price: "3.00"}}
        });
    });
});

describe("POST /items", function(){
    test("adds an item", async function(){
        const resp = await request(app)
        .post(`/items`)
        .send({
             name: "chicken", price: "3.00"
        });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
           added:{item: {name: "chicken", price: "3.00"}}
        })
    })
})