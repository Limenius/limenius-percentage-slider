<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Jasmine Spec Runner</title>
<% css.forEach(function(style){ %>
  <link rel="stylesheet" type="text/css" href="<%= style %>">
<% }) %>
</head>
<body>
    <input id="percentage1" type="text"/>
    <input id="percentage2" type="text"/>
    <input id="percentage3" type="text"/>

<% with (scripts) { %>
  <% [].concat(polyfills, jasmine, boot, vendor, helpers, src, specs,reporters).forEach(function(script){ %>
  <script src="<%= script %>"></script>
  <% }) %>
<% }; %>

</body>
</html>
