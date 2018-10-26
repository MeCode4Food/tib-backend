const Docs = require("express-api-doc");
const app = require("../server");

// express api documentation
const dock = new Docs(app);
dock.track({
    path: './docs/examples.txt' // responses and requests will save here
})

dock.generate({
    path: './docs/template.html',
    examples: './docs/examples.txt'
});
