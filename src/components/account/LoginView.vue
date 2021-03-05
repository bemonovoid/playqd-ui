<template>

  <v-row>
    <v-col>
      <v-card elevation="2">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-item-group>
            <v-text-field label="Account name" placeholder="Account name" required v-model="account.username"></v-text-field>
            <v-text-field label="Password" placeholder="Password" required
                          :type="showPassword ? 'text' : 'password'"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="showPassword = !showPassword"
                          v-model="account.password">
            </v-text-field>
          </v-item-group>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn text class="text-capitalize" @click="createAccount()">Create new account</v-btn>
          <v-btn color="blue-grey lighten-3" class="text-capitalize" @click="login()">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>

import api from "@/http/playqdAPI";

export default {
  name: 'LoginView',
  data() {
    return {
      showPassword: false,
      account: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      api.login(this.account).then(response => {
          this.$store.commit('setLoginSuccess', this.account);
          this.$router.push({name: 'LibraryView'});
      });
    },
    createAccount() {
      this.$router.push({name: 'SignInView'});
    }
  }
}

</script>