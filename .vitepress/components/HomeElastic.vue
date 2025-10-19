<script setup>
import Appear from "./Appear.vue";
import Code from "./Code.vue";
</script>
<template>
  <Appear>
    <div class="nx-v">3.</div>
    <div class="nx-info">
      <h3>Гибкость без боли</h3>
      <p>
        Nuxoblivius масштабируется вместе с вашим приложением. Хотите простую
        страницу или модульную систему — пишите одинаково легко.
      </p>
    </div>
    <div class="nx-code">
      <Code>
        <b l-m>import</b> { defineSingleton, Record }
        <b l-m>from</b> "nuxoblivius";
        <br />
        <b l-m>import</b> useLanguage <b l-m>from</b> "./store/Language";
        <br /><br />
        <b l-m>class</b> Posts {<br />
        <span class="text-tab"></span><b l-m>private</b> lang =
        useLanguage();<br /><br />
        <span class="text-tab" /><b l-m>public</b> posts =
        <b>Record</b>.new&lt;<b l-q>IPosts</b>[]&gt;("/api/posts", [])<br />
        <span class="text-tab" /><span class="text-tab" />.query({<br />
        <span class="text-tab" /><span class="text-tab" /><span
          class="text-tab"
        />lang: () => <b l-m>this</b>.lang.current<br />
        <span class="text-tab" /><span class="text-tab" />});<br />
        }<br /><br />
        <b l-m>export default</b> defineSingleton(<b>Posts</b>);
      </Code>
    </div>
  </Appear>
</template>
