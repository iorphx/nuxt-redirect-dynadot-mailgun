<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt-lg--8 mt--6 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="checklist-item checklist-item-danger mb-4" v-if="SignInError">
                {{ SignInError }}
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <form role="form" @submit.prevent="handleSubmit(signin)">
                  <base-input alternative
                              class="mb-3"
                              name="이메일"
                              :rules="{required: true, email: true}"
                              prepend-icon="ni ni-email-83"
                              placeholder="이메일"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="비밀번호"
                              :rules="{required: true, min: 6}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="비밀번호"
                              v-model="model.password">
                  </base-input>

                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="mt-4">로그인</base-button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    layout: 'AuthLayout',
    data() {
      return {
        model: {
          email: '',
          password: ''
        },
        SignInError: null
      };
    },
    methods: {
      async signin() {
        try {
          await this.$store.dispatch('signin', {
            email: this.model.email,
            password: this.model.password
          })
          this.$router.go('/redirect')
        }
        catch (err) { this.SignInError = err.message }
      }
    }
  };
</script>