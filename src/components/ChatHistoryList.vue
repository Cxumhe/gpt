<script setup></script>
<template>
    <ol>
        <slot></slot>
    </ol>
</template>
<style scoped>
ol {
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: scroll;
}
</style>
