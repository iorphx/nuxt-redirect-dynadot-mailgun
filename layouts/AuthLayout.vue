<template>
  <div :class="layoutClass" class="auth-layout">
    <base-nav
      v-model="showMenu"
      type="light"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main"
      expand="lg"
    >

     <template>
       <div class="navbar-collapse-header">
         <div class="row">
           <div class="col collapse-brand">
             <h2 class="my-auto">Poppin'Party</h2>
           </div>
           <div class="col-auto my-auto" @click="signout" v-if="this.$store.state.authUser">
             <i class="fas fa-sign-out-alt text-default text-lg"></i>
           </div>
           <div class="col-auto collapse-close my-auto">
             <button type="button" class="navbar-toggler" @click="showMenu = false">
               <span></span>
               <span></span>
             </button>
           </div>
         </div>
       </div>

       <ul class="navbar-nav mr-auto">
         <li class="nav-item">
           <nuxt-link to="/redirect" class="nav-link">
             <span class="nav-link-inner--text">리디렉션</span>
           </nuxt-link>
         </li>
         <li class="nav-item">
           <nuxt-link to="/subdomain" class="nav-link">
             <span class="nav-link-inner--text">서브 도메인</span>
           </nuxt-link>
         </li>
         <li class="nav-item">
           <nuxt-link to="/mail" class="nav-link">
             <span class="nav-link-inner--text">메일</span>
           </nuxt-link>
         </li>
       </ul>
       <base-button class="d-none d-lg-block" type="neutral" outline @click="signout" v-if="this.$store.state.authUser">로그아웃</base-button>
     </template>
    </base-nav>

    <div class="main-content">
      <nuxt></nuxt>
    </div>

  </div>
</template>
<script>
  import BaseNav  from '~/components/argon-core/Navbar/BaseNav.vue';

  export default {
    components: {
      BaseNav,
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        pageClass: 'login-page',
      };
    },
    computed: {
      title() {
        return `${this.$route.name} Page`;
      },
      layoutClass() {
        let exceptions = ['index', 'home']
        if (!exceptions.includes(this.$route.name)) {
          return 'bg-default'
        } else {
          return ''
        }
      }
    },
    methods: {
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
      async signout() {
        try {
          await this.$store.dispatch('signout')
            .then(() => this.$router.go())
        }
        catch (err) {
          this.$notify({ type: 'danger', message: err, timeout: 6000 })
          console.log(err)
        }
      }
    },
    watch: {
      '$route.path'() {
        if (this.showMenu) {
          this.closeMenu();
        }
      }
    }
  };
</script>
<style lang="scss">
  .auth-layout {
    min-height: 100vh;
  }

  * {
    font-family: 'Open Sans', 'Noto Sans KR', sans-serif;
  }
</style>
