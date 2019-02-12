<template>
  <div>
    <b-alert show variant="success">You should see this page without need to authentication!</b-alert>
  </div>
</template>

<script>
export default {
  middleware: ['init-auth', 'auth'],
  options: {
    auth: false
  }
}
</script>
