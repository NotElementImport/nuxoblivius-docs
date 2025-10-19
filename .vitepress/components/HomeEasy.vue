<script setup>
import Appear from "./Appear.vue";
import Code from "./Code.vue";
</script>
<template>
  <Appear>
    <div class="nx-v">1.</div>
    <div class="nx-info">
      <h3>Мгновенный старт</h3>
      <p>
        Написать <b>MVP</b> можно за минуты — без лишних слоёв, шаблонов и
        магии. Просто импортируйте модули, и код уже работает.
      </p>
      <a href="/nuxoblivius-docs/release/state-manager"
        >Узнать больше о State Manager(-е)</a
      >
    </div>
    <Code
      ><b l-m>import</b> { defineFactory } <b l-m>from</b> "nuxoblivius";
      <br /><br />
      <b l-m>class</b> Counter { <br /><span class="text-tab"></span
      ><b l-m>public</b> counter: <b l-q>number</b> = <i l-n>0</i>; <br />}
      <br /><br /><b l-m>export default</b>
      defineFactory(<b>Counter</b>);
    </Code>
  </Appear>
</template>
