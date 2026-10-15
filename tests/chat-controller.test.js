const test = require('node:test');
const assert = require('node:assert/strict');

process.env.GROQ_API_KEY = '';
const { getGroqClient } = require('../src/controllers/chat.controller');

test('getGroqClient devuelve null cuando no hay API key', () => {
  assert.equal(getGroqClient(), null);
});
