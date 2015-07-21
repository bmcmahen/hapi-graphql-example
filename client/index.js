import debug from 'debug'
import $ from 'jquery'

debug.enable('client*')


let query = require('./query')
let mutate = require('./mutation')

let model = {}

function updateModel(attrs) {
  Object.assign(model, attrs)
  $('#query-result').empty().html(JSON.stringify(model, null, '\t'))
}


$('#query').on('submit', (e) => {
  e.preventDefault()
  let id = $('#query').serializeArray()[0].value
  query(id, function(err, res) {
    if (err) return alert(err)
    updateModel(res.body.data.human)
  })
})

$('#mutate').on('submit', (e) => {
  e.preventDefault()
  let attrs = $('#mutate').serializeArray()
  mutate(attrs[0].value, attrs[1].value, function(err, res){
    if (err) return alert(err)
    updateModel(res.body.data.updateHuman)
  })
})
