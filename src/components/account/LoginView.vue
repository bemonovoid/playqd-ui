<template>

  <v-row>
    <v-col>
      <v-card elevation="2">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form>
            <v-item-group>
              <v-text-field label="Account name" placeholder="Account name" required v-model="account.username"></v-text-field>
              <v-text-field label="Password" placeholder="Password" required autocomplete="off"
                            @keydown.enter="login()"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            v-model="account.password">
              </v-text-field>
            </v-item-group>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-space-between">
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
          this.$store.commit('setUserAuthToken', response.data.authToken);
          this.$router.push({name: 'LibraryView'});
      });
    }
  }
}

</script>