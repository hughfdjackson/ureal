void function(root){
    
    var id = function(v){ return v }
    var spy = function(v){ console.log(v); return v }

    var parse = function(url){
        return pipe(
            parseProtocol,
            parseDomainPart,
            parsePathPart,
            parseParamsPart
        )({ data: {}, rest: url }).data
    }

    var parseProtocol = function(o){
        
        if ( contains(o.rest, '://') ) {
            o.data.protocol = before(o.rest, '://')
            o.rest = after(o.rest, '://')
        } 
        return o
    }


    var parseDomainPart = function(o){
        var domainPart = before(o.rest, '/')
            
        var data =  pipe(
                parseUserPass,
                parseDomain,
                parsePort
            )({ data: o.data, rest: domainPart }).data
        
        o.data = extend(o.data, data)
        o.rest = from(o.rest, '/')
        
        return o
    }

    var parseUserPass = function(o){
        if ( contains(before(o.rest, '/'), '@') ) {
            var userPass = before(o.rest, '@')
            o.data.user = before(userPass, ':')
            o.data.password = after(userPass, ':')
            o.rest = after(o.rest, '@')
        }
        return o
    }
    
    var parseDomain = function(o){
        o.data.domain = contains(o.rest, ':') ? before(o.rest, ':') : before(o.rest, '/')
        o.rest = contains(o.rest, ':') ? from(o.rest, ':') : from(o.rest, '/')

        return o
    }
    
    var parsePort = function(o){
        if ( contains(before(o.rest, '/'), ':') ) {
            o.data.port = parseInt(between(o.rest, ':', '/'))
        }
        o.rest = from(o.rest, '/')
        return o
    }

    var parsePathPart = function(o){
        if ( contains(o.rest, '/') ) {
            var pathPart = between(o.rest, '/', '?')
            o.data.path = pathPart.split('/').filter(function(v){ return v !== '' })
        }
        o.rest = from(o.rest, '?')
        return o
    }
    
    var parseParamsPart = function(o){
        var parts = []
        
        if ( contains(o.rest, '?') ) {
            
            var str = after(o.rest, '?')
            if ( contains(str, '&') ) parts = str.split('&')
            else                      parts = [str]

            o.data.params = parts.reduce(function(data, part){
                data[before(part, '=')] = after(part, '=')
                return data
            }, {})
        }

        return o
    }

    
    var stringify = function(o){
        
        var protocol = o.protocol || 'http'        

        var url = ''

        if ( protocol )             url += protocol + '://'
        if ( o.user && o.password ) url += o.user + ':' + o.password + '@'
        if ( o.domain )             url += o.domain
        if ( o.port )               url += ':' + o.port.toString()
        if ( o.path )               url += '/' + o.path.join('/')
        else if ( o.params )        url += '/'
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
        pipe = function(){
            var fns = [].slice.call(arguments)
            return function(arg){
                return fns.reduce(function(res, fn){
                    return fn.call(null, res)
                }, arg)
            }
        },
        before = function(str, v){
            return str.split(v)[0]
        },
        after = function(str, v){
            return str.split(v).slice(1).join(v)
        },
        between = function(str, start, end){
            return after(before(str, end), start)
        },
        from = function(str, v){
            return v + after(str, v)
        }
        extend = function(t, f){
            for ( var p in f ) t[p] = f[p]
            return t
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
