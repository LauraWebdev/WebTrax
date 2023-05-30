<template>
  <section class="panel-status">
    <span class="copyright">Created by <a
      href="https://laura.media"
      target="_blank"
    >Laura Sofia Heimann</a></span>

    <nav>
      <a
        href="https://github.com/LauraWebdev/WebTrax"
        target="_blank"
      >Github</a>
      <a
        href="https://habbo.com"
        target="_blank"
      >Habbo</a>
    </nav>
  </section>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.panel-status {
    display: grid;
    grid-template-columns: 1fr auto;

    & .copyright {
        padding: 15px;

        &:not(a) {
            color: rgba(255,255,255,0.4);
        }
        & a {
            color: #fff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    & nav {
        display: flex;
        padding: 15px;
        gap: 15px;

        & a {
            color: #fff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>