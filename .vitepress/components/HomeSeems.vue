<script setup>
import Appear from "./Appear.vue";
import Code from "./Code.vue";
</script>
<template>
  <Appear alt>
    <div class="nx-v">2.</div>
    <Code>
      <b l-m>import</b> { Record } <b l-m>from</b> "nuxoblivius"; <br /><br />
      <b l-m>const</b> posts = <b>Record</b>.new("/api/posts", []);<br /><br />
      <b l-m>const</b> response = <b l-m>await</b> posts.get();</Code
    >
    <div class="nx-info">
      <h3>Единый синтаксис для запросов</h3>
      <p>
        Работайте с данными так, как привыкли: знакомый синтаксис
        <b>axios</b>, но с возможностями <b>Vue</b> и <b>Nuxt</b> —
        реактивностью, контекстами и стором.
      </p>
      <a href="/nuxoblivius-docs/release/record/base">Узнать больше о Record</a>
    </div>
  </Appear>
</template>
