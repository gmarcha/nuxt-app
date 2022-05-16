import Vue from 'vue'
import { mapGetters } from 'vuex'
import { IUser, IRole } from '@/store/user'

export const userMethods = Vue.extend({
  computed: {
    ...mapGetters({
      roleAdmin: 'users/roleAdmin',
      roleCalendar: 'users/roleCalendar',
      roleTutor: 'users/roleTutor',
    })
  },

  methods: {
    getUserRoles(user: IUser): IRole[] {
      return user.edges?.roles || []
    },
    getRolesSortedByName(roles: IRole[]): IRole[] {
      return (
        [...roles]?.sort(
          (a: IRole, b: IRole) => (a.name < b.name ? 1 : -1)
        ) || []
      )
    },
    getRolesNames(roles: IRole[]): string[] {
      return (
        roles?.map(
          (el: IRole) => el.name.charAt(0).toUpperCase() + el.name.slice(1)
        ) || []
      )
    },
    getUserRolesNames(user: IUser): string[] {
      return this.getRolesNames(this.getUserRoles(user))
    },
    getRoleNameColor(roleName: string): string {
      switch (roleName.toLowerCase()) {
        case 'admin':
          return 'purple'
        case 'calendar':
          return 'blue'
        case 'tutor':
          return 'primary'
        default:
          return 'grey'
      }
    },
    getRoleByName(roleName: string): IRole {
      switch (roleName.toLowerCase()) {
        case 'admin':
          return this.roleAdmin
        case 'calendar':
          return this.roleCalendar
        case 'tutor':
          return this.roleTutor
        default:
          return {} as IRole
      }
    },
  }
})
