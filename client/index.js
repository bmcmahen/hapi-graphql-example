import debug from 'debug'
import $ from 'jquery'

debug.enable('client*')


let query = require('./query')
let mutate = require('./mutation')

$('#query').on('submit', (e) => {
  e.preventDefault();
  let id = $('#query').serializeArray()[0].value
  query(id, function(err, res) {
    if (err) return alert(err)
    $('#query-result').html(JSON.stringify(res.body))
  })
})