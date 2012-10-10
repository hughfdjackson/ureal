var a     = require('assert'),
    ureal = require('../')

suite('ureal.stringify')

test('protocol & domain - http://google.com', function(){
    
    var url1 = ureal.stringify({ domain: 'google.com' }),
        url2 = ureal.stringify({ domain: 'google.com', protocol: 'http' })

    a.equal(url1, 'google.com')
    a.equal(url2, 'http://google.com')
})


test('with path - http://google.com/search/my-term', function(){
    
    var url = ureal.stringify({ protocol: 'http', domain: 'google.com', path: ['search', 'my-term'] })
    
    a.equal(url, 'http://google.com/search/my-term')
})

test('with port - http://google.com:8081', function(){
    
    var url = ureal.stringify({ protocol: 'http', domain: 'google.com', port: 8081 })
    
    a.equal(url, 'http://google.com:8081')
})

test('with user and password - http://auth:pass@google.com', function(){

    var url = ureal.stringify({ protocol: 'http', domain: 'google.com', user: 'auth', password: 'pass' })
   
    a.equal(url, 'http://auth:pass@google.com')
})

test('with querystring - http://google.com/?search=my-term&other-search=my-other-term', function(){

    var url = ureal.stringify({
        protocol: 'http',
        domain: 'google.com',
        params: {
            search: 'my-term',
            'other-search': 'my-other-term'
        }
    })

    a.equal(url, 'http://google.com/?search=my-term&other-search=my-other-term')
})


suite('ureal.parse')

test('basic - http://google.com', function(){
    
    var o = ureal.parse('http://google.com')

    a.equal(o.domain, 'google.com')
    a.equal(o.protocol, 'http')
})


test('with port - http://google.com:8081', function(){
    
    var o = ureal.parse('http://google.com:8081')

    a.equal(o.domain, 'google.com')
    a.equal(o.protocol, 'http')
    a.equal(o.port, 8081)
})

test('with user and password - http://user:pass@google.com', function(){

    var o = ureal.parse('http://user:pass@google.com')

    a.equal(o.domain, 'google.com')
    a.equal(o.user, 'user')
    a.equal(o.password, 'pass')
})

test('with path - http://google.com/search/term', function(){
    
    var o = ureal.parse('http://google.com/search/term')
    
    a.equal(o.domain, 'google.com')
    a.equal(o.protocol, 'http')
    a.equal(o.path[0], 'search')
    a.equal(o.path[1], 'term')
})

test('with querystring - http://google.com/?search=my-term&other-search=my-other-term', function(){
    
    var o = ureal.parse('http://google.com/?search=my-term&other-search=my-other-term')

    a.equal(o.domain, 'google.com')
    a.equal(o.protocol, 'http')
    a.equal(o.params.search, 'my-term')
    a.equal(o.params['other-search'], 'my-other-term')
})


suite('parse & stringify symetry')

test('parse & stringify symetry', function(){
    var urls = [
        'http://google.com',
        'admin:pass@www.foobar.com/pig/nose?are=the&base=',
        'https://www.far.bo:209232/asd'
    ]
    
    var symetric = function(url){ 
        var o    = ureal.parse(url),
            url2 = ureal.stringify(o)
        
        console.log(o, url2)
        a.equal(url, url2) 
    }

    urls.forEach(symetric)
})
