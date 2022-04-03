<template>
    <div class="display-info col-4">
        <div class="display-info-content">
            <div>
                <span>nombre:</span>
                <span>{{ formValues.name }}</span>
            </div>
            <div>
                <span>email:</span>
                <span class="truncate">{{ formValues.email }}</span>
            </div>
            <div>
                <span>phone:</span>
                <span>{{ formValues.phone }}</span>
            </div>
            <div>
                <span>plan:</span>
                <span>{{ selectedPlan }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
 const props = defineProps(['formValues', 'selectedPlan'])
</script>
<style lang="scss">
.display-info {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    .p-card-content {
        padding: 0 !important;
    }
    .display-info-content {
        font-size: 11px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: left;
        background: #3f51b5;
        width: 11rem;
        border-radius: 10px;
        color: white;
        line-height: 2;
        height: 6rem;
        padding: 0 24px;
        position: fixed;
        top: 13px;
        & > div {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    }
}
</style>
