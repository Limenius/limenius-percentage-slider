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
    <input id="percentage1" class="inputtest" type="text"/>
    <input id="percentage2" class="inputtest" type="text"/>
    <input id="percentage3" class="inputtest" type="text"/>
    <div id="slider-holder"></div>

<% with (scripts) { %>
  <% [].concat(polyfills, jasmine, boot, vendor, helpers, src, specs,reporters).forEach(function(script){ %>
  <script src="<%= script %>"></script>
  <% }) %>
<% }; %>

</body>
</html>
