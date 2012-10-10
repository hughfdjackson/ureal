void function(root){
    
    
    
    var parse = function(url){
        return compact({
            protocol: parseProtocol(url)

        })
    }

    var parseProtocol = function(url){
        return contains(url, '://') ? url.split('://')[0] : null
    }
     
    var parseDomain = function(url){
        if ( parseProtocol(url) ) url = url.split('://')[1]
        if ( contains(url, '/') ) url = url.split('/')[0]

        return url
    }

    var stringify = function(o){
        
        var protocol = o.protocol || 'http'        

        var url = ''

        if ( protocol )             url += protocol + '://'
        if ( o.user && o.password ) url += o.user + ':' + o.password + '@'
        if ( o.domain )             url += o.domain
        if ( o.port )               url += ':' + o.port.toString()
        if ( o.path )               url += '/' + o.path.join('/')
        if ( o.params )             url += '?' + stringifyParams(o.params)

        return url
    }
    
    
    var stringifyParams = function(o){
        var pairs = Object.keys(o).map(function(key){
            return key + '=' + o[key]
        })

        return pairs.join('&')
    }


    // helpers

    var contains = function(outer, inner){
             return outer.indexOf(inner) != -1
        },
        compact = function(o){
            Object.keys(o).forEach(function(key){
                if ( o[key] == null ) delete o[key]
            })
            return o
        }
  

    // export
    var ureal = {
        stringify: stringify,
        parse: parse 
    }
    
    if ( typeof module != 'undefined' && module.exports ) 
       module.exports = ureal
    else if ( typeof define == 'function' )
        define(unreal)
    else
        root.ureal = ureal

}(this)
