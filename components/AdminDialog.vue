<template>
  <v-card flat>
    <v-toolbar flat style="z-index: 3">
      <v-toolbar-title>Gestion des tuteurs</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-list>
        <v-list-item>
          <v-list-item-content class="mr-2">
            <v-text-field
              v-model="userName"
              label="Login de l'étudiant"
              placeholder="marvin"
              :rules="[rules.required]"
              hide-details
              dense
              outlined
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-content class="mr-2">
            <v-text-field
              v-model="userDisplayName"
              label="Surnom"
              hide-details
              dense
              outlined
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-content>
            <v-select
              v-model="userRoles"
              :items="userRolesList"
              label="Roles"
              hide-details
              multiple
              dense
              outlined
            >
              <template #selection="{ item, index }">
                <span v-if="index === 0" class="mr-1">
                  {{ item }}
                </span>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ userRoles.length - 1 }})
                </span>
              </template>
            </v-select>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="createUser">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-form>
    <v-divider />
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Rechercher"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-actions>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="areUsersLoading"
        loading-text="Chargement des utilisateurs..."
        no-results-text="Aucun résultat ne correspond à la recherche."
        mobile-breakpoint="0"
        :footer-props="{
          'items-per-page-text': 'Utilisateurs par page',
          'items-per-page-all-text': 'Tous',
        }"
        locale="fr-FR"
        style="width: 100%"
      >
        <template #[`header.login`]="{ header }">
          <span class="ml-8">{{ header.text }}</span>
        </template>
        <template #[`item.login`]="{ item }">
          <div class="d-flex">
            <v-avatar size="24" class="mr-2">
              <v-img :src="item.imagePath"></v-img>
            </v-avatar>
            {{ item.login }}
          </div>
        </template>
        <template #[`item.displayName`]="{ item }">
          <v-edit-dialog
            large
            cancel-text="Annuler"
            save-text="Enregistrer"
            @save="updateUser(item)"
          >
            <span class="text-no-wrap">{{ item.displayName }}</span>
            <template #input>
              <v-text-field
                :value="item.displayName"
                :rules="[rules.required]"
                label="Modifier"
                hide-details
                single-line
                autofocus
                @input="(val) => (newUserDisplayName = val)"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template #[`item.edges.roles`]="{ item: user }">
          <v-edit-dialog
            large
            cancel-text="Annuler"
            save-text="Enregistrer"
            @save="updateUserRoles(user)"
          >
            <v-chip
              v-for="role in getRolesSortedByName(getUserRoles(user))"
              :key="role.id"
              :color="getRoleNameColor(role.name)"
              label
              small
              class="ma-2"
            >
              {{ role.name.charAt(0).toUpperCase() + role.name.slice(1) }}
            </v-chip>
            <template #input>
              <v-select
                :value="getUserRolesNames(user)"
                :items="userRolesList"
                label="Modifier"
                :menu-props="{ top: true, offsetY: true }"
                hide-details
                multiple
                @input="val => newUserRoles = val"
              >
                <template #selection="{ item: roleName }">
                  <v-chip
                    :color="getRoleNameColor(roleName.toLowerCase())"
                    label
                    small
                    class="my-2 mr-2"
                  >
                    {{ roleName }}
                  </v-chip>
                </template>
              </v-select>
            </template>
          </v-edit-dialog>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-dialog max-width="256">
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="ml-5"
                v-on="on"
                @click="selectedUser = item"
              >
                mdi-delete
              </v-icon>
            </template>
            <DeleteDialog :title="item.login" :action="deleteUser">
              Toutes les participations aux événements seront annulées.
            </DeleteDialog>
          </v-dialog>
        </template>
      </v-data-table>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { userMethods } from  '@/mixins/userMethods'
import { IRole, IUser } from '@/store/user'

export default mixins(userMethods).extend({
  data: () => ({
    valid: true,
    search: '',
    userName: '',
    userDisplayName: '',
    userRoles: [] as string[],
    userRolesList: ['Tutor', 'Calendar', 'Admin'],
    newUserDisplayName: '',
    newUserRoles: [] as string[],
    selectedUser: {} as IUser,
    headers: [
      { text: 'Login', value: 'login' },
      { text: 'Surnom', value: 'displayName' },
      { text: 'Rôles', value: 'edges.roles' },
      { text: 'Supprimer', value: 'actions', sortable: false },
    ],
    rules: {
      required: (value: string) => !!value || 'Requis.',
    },
  }),

  computed: {
    ...mapState({
      users: (state: any): IUser[] => state.users.users,
      roles: (state: any): IRole[] => state.users.roles,
    }),
    ...mapGetters({
      areUsersLoading: 'users/areUsersLoading',
    }),
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    async createUser() {
      if (!(this.$refs.form as any).validate()) {
        this.valid = false
        return
      }
      try {
        const { id: userID } = await this.$store.dispatch('users/createUser', {
          login: this.userName,
          displayName: this.userDisplayName,
        })
        for (const role of this.userRoles) {
          await this.$store.dispatch('users/setRole', {
            userID,
            role: this.getRoleByName(role),
          })
        }
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(`Erreur lors de la création de l'utilisateur.`)
        this.setSnackbar(true)
      }
    },
    async updateUser(user: IUser) {
      try {
        await this.$store.dispatch('users/updateUser', {
          ...user,
          displayName: this.newUserDisplayName,
        })
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(`Erreur lors de la création de l'utilisateur.`)
        this.setSnackbar(true)
      }
    },
    async updateUserRole(
      userRoles: string[],
      userID: string,
      roleName: string,
      role: IRole
    ) {
      if (
        !userRoles.includes(roleName) &&
        this.newUserRoles.includes(roleName)
      )
        await this.$store.dispatch('users/setRole', { userID, role })
      else if (
        userRoles.includes(roleName) &&
        !this.newUserRoles.includes(roleName)
      )
        await this.$store.dispatch('users/unsetRole', { userID, role })
    },
    async updateUserRoles(user: IUser) {
      try {
        const userRoles = this.getUserRolesNames(user)
        for (const roleName of this.userRolesList) {
          await this.updateUserRole(
            userRoles,
            user.id,
            roleName,
            this.getRoleByName(roleName)
          )
        }
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          `Erreur lors de la modification des rôles de l'utilisateur.`
        )
        this.setSnackbar(true)
      }
    },
    async deleteUser() {
      try {
        await this.$store.dispatch('users/deleteUser', this.selectedUser.id)
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          `Erreur lors de la suppression de l'utilisateur.`
        )
        this.setSnackbar(true)
      }
    },
  },
})
</script>
