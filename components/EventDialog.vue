<template>
  <v-card flat>
    <v-toolbar flat style="z-index: 3">
      <v-toolbar-title>
        {{ update ? 'Modifier' : 'Ajouter' }} un événement</v-toolbar-title
      >
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-actions>
        <v-row class="ma-0">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-date-picker
              v-model="dates"
              locale="fr-FR"
              range
              no-title
              :first-day-of-week="1"
              :show-current="false"
              :allowed-dates="allowedDates"
            ></v-date-picker>
          </v-col>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    v-model="eventName"
                    label="Nom de l'événement"
                    placeholder="Exam Stud"
                    :rules="[rules.required]"
                    hide-details
                    dense
                    outlined
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    v-model="startDateFormated"
                    :label="endDateFormated ? 'Du' : 'Le'"
                    :rules="[rules.required]"
                    hide-details
                    dense
                    outlined
                    readonly
                  ></v-text-field>
                </v-list-item-content>
                <v-list-item-content v-if="endDateFormated" class="ml-2">
                  <v-text-field
                    v-model="endDateFormated"
                    label="jusqu'au"
                    hide-details
                    disabled
                    dense
                    outlined
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="mr-2">
                  <v-text-field
                    v-model="times[0]"
                    :label="endDateFormated ? 'à' : 'De'"
                    placeholder="00:00"
                    type="time"
                    :rules="[rules.required]"
                    hide-details
                    dense
                    outlined
                  >
                  </v-text-field>
                </v-list-item-content>
                <v-list-item-content>
                  <v-text-field
                    v-model="times[1]"
                    label="à"
                    placeholder="00:00"
                    type="time"
                    :rules="[rules.required]"
                    hide-details
                    dense
                    outlined
                  >
                  </v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="mr-2">
                  <v-text-field
                    v-model="tutorsRequired"
                    label="Tuteurs"
                    :rules="[rules.required, rules.number]"
                    dense
                    outlined
                  ></v-text-field>
                </v-list-item-content>
                <v-list-item-content>
                  <v-text-field
                    v-model="walletsReward"
                    label="Récompenses"
                    prefix="₳"
                    :rules="[rules.required, rules.number]"
                    dense
                    outlined
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-actions>
        <v-select
          v-model="categorySelected"
          :items="categoriesNames"
          label="Catégorie"
          :rules="[rules.required]"
          hide-details
          dense
          outlined
          class="mr-2"
        >
          <template #item="{ item }">
            <v-avatar
              :color="categories.find((el) => el.name === item).color"
              size="18"
              class="mr-4"
            />
            {{ item }}
          </template>
        </v-select>
        <v-btn icon :disabled="!categorySelected" @click="editCategory">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="createCategory">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
      <v-form ref="categoryForm" v-model="categoryValid" lazy-validation>
        <v-card-actions v-if="categoryEditOpen || categoryCreateOpen">
          <v-text-field
            v-model="categoryName"
            :label="
              categoryEditOpen ? 'Modifier la catégorie' : 'Nouvelle catégorie'
            "
            :rules="[rules.required]"
            hide-details
            dense
            outlined
            class="mr-2"
          ></v-text-field>
          <v-menu :close-on-content-click="false">
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                outlined
                :color="categoryColor"
                v-bind="attrs"
                :class="categoryEditOpen ? 'mr-2' : ''"
                v-on="on"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
            <v-color-picker v-model="categoryColor"></v-color-picker>
          </v-menu>
          <v-dialog v-if="categoryEditOpen" max-width="256">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <DeleteDialog :title="categorySelected" :action="deleteCategory">
              Attention, les événements de cette catégorie se retrouveront sans
              catégorie.
            </DeleteDialog>
          </v-dialog>
          <v-btn icon @click="upsertCategory">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
      <v-card-actions>
        <v-textarea
          v-model="eventDescription"
          label="Description"
          placeholder="Exam Alone in the Dark, Exam Rank 02/03/04/05/06 for example..."
          hide-details
          rows="3"
          outlined
          clearable
          no-resize
        ></v-textarea>
      </v-card-actions>
      <v-card-actions v-if="!update">
        <v-text-field
          v-model="repeatCount"
          label="Répéter l'événement ?"
          suffix="fois"
          :rules="[rules.required, rules.number]"
          dense
          outlined
          class="mr-2"
        ></v-text-field>
        <v-select
          v-model="repeatType"
          :items="repeatTypeList"
          label="chaque..."
          dense
          outlined
        ></v-select>
      </v-card-actions>
      <v-card-actions class="pb-4 justify-center">
        <v-btn x-large class="px-4" @click="upsertEvent"> Valider </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  props: {
    update: {
      type: Boolean as () => boolean,
      default: false,
    },
    name: {
      type: String as () => string,
      default: '',
    },
    description: {
      type: String as () => string,
      default: '',
    },
    start: {
      type: String as () => string,
      default: '',
    },
    end: {
      type: String as () => string,
      default: '',
    },
    tutors: {
      type: Number as () => number,
      default: 0,
    },
    reward: {
      type: Number as () => number,
      default: 0,
    },
    category: {
      type: String as () => string,
      default: '',
    },
  },

  data() {
    return {
      valid: true,
      categoryValid: true,
      eventName: this.name || '',
      eventDescription: this.description || '',
      dates:
        this.start && this.end
          ? [
              this.start.substring(0, this.start.indexOf(' ')),
              this.end.substring(0, this.end.indexOf(' ')),
            ]
          : ['', ''],
      times:
        this.start && this.end
          ? [
              this.start.substring(this.start.indexOf(' ') + 1),
              this.end.substring(this.end.indexOf(' ') + 1),
            ]
          : ['00:00', '00:00'],
      tutorsRequired: this.tutors?.toString() || '0',
      walletsReward: this.reward?.toString() || '0',
      categorySelected: this.category || '',
      categoryName: '',
      categoryColor: '#ffffff',
      categoryEditOpen: false,
      categoryCreateOpen: false,
      repeatCount: '1',
      repeatType: 'semaine',
      repeatTypeList: ['jour', 'semaine', 'mois'],
      rules: {
        required: (value: string) => !!value || 'Requis.',
        number: (value: string) => /^[0-9]*$/.test(value) || 'Invalide.',
      },
    }
  },

  computed: {
    ...mapState({
      isMobile: (state: any) => state.isMobile,
      selectedEvent: (state: any) => state.events.selectedEvent,
      categories: (state: any) => state.events.eventTypes,
    }),
    ...mapGetters({
      categoriesNames: 'events/eventTypesNames',
    }),
    startDateFormated(): string {
      return this.dates[0] ? this.$dayjs(this.dates[0]).format('DD/MM/YY') : ''
    },
    endDateFormated(): string {
      return this.dates[1] ? this.$dayjs(this.dates[1]).format('DD/MM/YY') : ''
    },
  },

  watch: {
    dates: {
      deep: true,
      handler(newValue) {
        if (newValue[0] > newValue[1]) {
          newValue.push(newValue[0])
          newValue.shift()
        }
      },
    },
    categorySelected(newValue) {
      if (this.categoryEditOpen) {
        this.categoryName = newValue
        this.categoryColor =
          this.categories.find((el: any) => el.name === newValue)?.color ||
          '#ffffff'
      }
    },
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    allowedDates(val: string) {
      return this.$dayjs().format('YYYY-MM-DD') <= val
    },
    getRepeatType(repeatType: string) {
      switch (repeatType) {
        case 'jour':
          return 'day'
        case 'semaine':
          return 'week'
        case 'mois':
          return 'month'
        default:
          return ''
      }
    },
    editCategory() {
      if (this.categoryCreateOpen) {
        this.categoryEditOpen = true
        this.categoryCreateOpen = false
      } else {
        this.categoryEditOpen = !this.categoryEditOpen
      }
      this.categoryName = this.categorySelected
      this.categoryColor =
        this.categories.find((el: any) => el.name === this.categorySelected)
          ?.color || '#ffffff'
    },
    createCategory() {
      if (this.categoryEditOpen) {
        this.categoryCreateOpen = true
        this.categoryEditOpen = false
      } else {
        this.categoryCreateOpen = !this.categoryCreateOpen
      }
      this.categoryName = ''
      this.categoryColor = '#ffffff'
    },
    async upsertCategory() {
      if (!(this.$refs.categoryForm as any).validate()) {
        this.categoryValid = false
        return
      }
      try {
        if (this.categoryEditOpen) {
          const id = this.categories.find(
            (el: any) => el.name === this.categorySelected
          ).id
          await this.$store.dispatch('events/updateEventType', {
            id,
            name: this.categoryName,
            color: this.categoryColor,
          })
          this.categoryEditOpen = false
        } else if (this.categoryCreateOpen) {
          await this.$store.dispatch('events/createEventType', {
            name: this.categoryName,
            color: this.categoryColor,
          })
          this.categoryCreateOpen = false
        }
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          `Erreur lors de la ${
            this.categoryEditOpen ? 'modification' : 'création'
          } de la catégorie.`
        )
        this.setSnackbar(true)
      }
    },
    async deleteCategory() {
      const id = this.categories.find(
        (el: any) => el.name === this.categorySelected
      ).id
      try {
        await this.$store.dispatch('events/deleteEventType', id)
        this.categoryEditOpen = false
        this.categorySelected = ''
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          `Erreur lors de la suppression de la catégorie.`
        )
        this.setSnackbar(true)
      }
    },
    async upsertEvent() {
      if (!(this.$refs.form as any).validate()) {
        this.valid = false
        return
      }
      const eventType = this.categories.find(
        (el: any) => el.name === this.categorySelected
      )
      let event = {
        name: this.eventName,
        description: this.eventDescription,
        startAt:
          this.dates[0] +
          'T' +
          this.times[0] +
          ':00' +
          this.$dayjs().format('Z'),
        endAt:
          (this.dates[1] ? this.dates[1] : this.dates[0]) +
          'T' +
          this.times[1] +
          ':00' +
          this.$dayjs().format('Z'),
        tutorsRequired: parseInt(this.tutorsRequired),
        walletsReward: parseInt(this.walletsReward),
      }
      try {
        if (this.update) {
          await this.$store.dispatch('events/updateEvent', {
            eventID: this.selectedEvent.id,
            event,
          })
          await this.$store.dispatch('events/setEventType', {
            eventID: this.selectedEvent.id,
            eventType,
          })
        } else {
          for (let i = 0; i < parseInt(this.repeatCount); i++) {
            const res = await this.$store.dispatch('events/createEvent', event)
            await this.$store.dispatch('events/setEventType', {
              eventID: res.id,
              eventType,
            })
            event = { ...event }
            event.startAt = this.$dayjs(event.startAt)
              .add(1, this.getRepeatType(this.repeatType))
              .format()
            event.endAt = this.$dayjs(event.endAt)
              .add(1, this.getRepeatType(this.repeatType))
              .format()
          }
        }
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage("Erreur lors de la création de l'évenement.")
        this.setSnackbar(true)
      }
    },
  },
})
</script>
