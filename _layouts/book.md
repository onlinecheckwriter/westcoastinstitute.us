---
layout: default
---
{{ content }}
{% assign chapters = (site.chapters | where: "book" , page.book | sort: "weight") %}
{% for chapter in chapters %}
<div class="docs-section">
  <h2 id="{{ chapter.chapter }}" class="header-title">{{ chapter.title }}</a></h2>
  {{ chapter.content | markdownify }}
  {% assign paragraphs = (site.paragraphs | where: "chapter" , chapter.chapter | sort: "weight") %}
  {% for paragraph in paragraphs %}
  <div class="docs-section">
    <h3 id="{{ paragraph.slug }}">{{ paragraph.title }}</a></h3>
    {{ paragraph.content | markdownify }}
  </div>
  {% endfor %}
</div>
{% endfor %}
