Urls are, at their heart, serialised data-structures.  They're really awkward to work with, and everyone in the web-world has seen god-awful regex hacks in one project or another.  We don't use string manipulation on JSON, though; so why subject ourselves to it for urls?

# API

## ureal.parse(url) -> object

Like `JSON.parse`, `ureal.parse` takes a string (a url), and turns it into a userful datastructure.  For instance:

```javascript
        ureal.parse('https://user:password@secure.my-site.com/profile?edit=email')

```

Returns:

```javascript
{ protocol: 'https',
  user: 'user',
  password: 'password',
  domain: 'secure.my-site.com',
  path: [ 'profile' ],
  params: { edit: 'email' } }        
```

## ureal.stringify(object) -> url

`ureal.stringify` takes an object in the same format as `ureal.parse` emits, and constructs a url out of it:

```javascript
        
        ureal.stringify({ protocol: 'https',
                          user: 'user',     
                          password: 'password', 
                          domain: 'secure.my-site.com',
                          path: [ 'profile' ],         
                          params: { edit: 'email' } })
                                                                                                                                                   
```

Returns:

```javascript
        'https://user:password@secure.my-site.com/profile?edit=email'
```g