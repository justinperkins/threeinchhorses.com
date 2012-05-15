var app = {
  models: {},
  collections: {},
  views: {},
  routers: {}
}
app.models.Quote = Backbone.Model.extend({
});

app.collections.Quotes = Backbone.Collection.extend({
  model: app.models.Quote,
  url: 'http://search.twitter.com/search.json?q=from:enjoythesewords',
  sync: function(method, model, options){  
    options.timeout = 10000;  
    options.dataType = "jsonp";  
    return Backbone.sync(method, model, options);  
  },
  parse: function(response) {
    return response.results;
  }
})

app.views.Main = Backbone.View.extend({
  el: '#app',
  events: {
    'click ul li a': 'onClickItem'
  },
  initialize: function(){
    this.template = Handlebars.compile($('#app-template').html())
    this.quotes = new app.collections.Quotes();
    this.quotes.fetch({
      success: _.bind(function(){
        this.render()
      }, this)
    })
  },
  onClickItem: function(event){
    event && event.preventDefault();
    var el = $(event.currentTarget);
    var quote = this.quotes.get(el.data('id'))
    this.showQuote(quote)
  },
  showQuote: function(quote){
    this.$el.find('ul li').removeClass('active');
    this.$el.find('ul li[data-id=' + quote.id + ']').addClass('active');
    this.$el.find('h1').html(quote.get('text'))
  },
  render: function(){
    var data = {
      quotes: this.quotes.map(function(quote){
        var data = quote.toJSON();
        data.firstWord = data.text.split(' ')[0]
        return data;
      })
    }
    this.$el.html(this.template(data))
    this.showQuote(this.quotes.first())
  }
})

$(function(){
  new app.views.Main()
})