<template>
  <AdminNavbar/>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import AdminNavbar from '../../components/admin/AdminNavbar.vue';
export default {
    components: { AdminNavbar }
}
</script>

<style>

</style>