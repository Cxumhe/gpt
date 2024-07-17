<script setup>
import ChatHistoryList from "./ChatHistoryList.vue";
import ChatHistory from "./ChatHistory.vue";
import { watchEffect, ref } from "vue";
const props = defineProps(["ChatList"]);
const emit = defineEmits(["addNewChat", "clearLocalStorage"]);
</script>
<template>
    <div class="left-hand">
        <header>
            <button
                title="清除全部历史记录"
                class="clear-history"
                @click="$emit('clearLocalStorage')"
            ></button>
            <button
                title="添加新对话"
                @click="$emit('addNewChat')"
                class="add-new-chat"
            ></button>
        </header>
        <ChatHistoryList>
            <ChatHistory v-for="chat in props.ChatList" :chat="chat" />
        </ChatHistoryList>
    </div>
</template>
<style scoped>
header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

button {
    cursor: pointer;
}
button.clear-history {
    background-image: url(../assets/trash.png);
    color: var(--text-primary);
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-size: 50%;
    background-position: center;
    background-color: transparent;
    background-repeat: no-repeat;
}

button.add-new-chat {
    color: var(--text-primary);
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-position: center;
    background-color: transparent;
    background-repeat: no-repeat;
    background-image: url(../assets/addButton.svg);
}
button:hover {
    background-color: rgba(244, 244, 244, 1);
}
.left-hand {
    background-color: var(--sidebar-surface-primary);
    position: sticky;
    top: 0px;
    width: 260px;
    flex-shrink: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
