<template>

  <v-row>
    <v-col>
      <v-card elevation="2">
        <v-card-title>Create account</v-card-title>
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
        <v-card-actions>
          <v-btn block color="blue-grey lighten-3" @click="createAccount()">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>

import api from "@/http/playqdAPI"

export default {
  name: 'SignInView',
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
    createAccount() {
      api.createAccount(this.account).then(response => {
          this.$router.push({name: 'LibraryView'})
      });
    }
  }

}

</script>