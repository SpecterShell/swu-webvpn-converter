<template>
  <v-row justify="space-between" align="center" class="mx-4 mt-12 mt-lg-0 mt-xl-0">
    <v-col lg="6" xl="6" cols="12">
      <v-row class="text-h4 mb-4">
        <h4>
          <v-icon class="mr-2" color="primary">mdi-link-variant</v-icon
          ><a href="http://webvpn.swu.edu.cn/" target="_blank">WEBVPN</a> URL Converter
        </h4>
      </v-row>

      <v-row>
        <p class="text--secondary mb-8">
          🥑 <b>WEBVPN Converter</b> can help you convert a SWU local area network URL
          into its corresponding WEBVPN URL so that you can access SWU local resources
          from anywhere in the world.
        </p>
      </v-row>

      <v-row align="center" justify="center">
        <v-text-field
          label="Original URL"
          v-model="originalUrl"
          placeholder="http://jw.swu.edu.cn"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="clearInputUrl">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Clear input</span>
        </v-tooltip>
      </v-row>

      <v-row>
        <v-btn class="mx-auto my-4" color="primary" @click="convert">
          Convert <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </v-row>

      <v-row align="center" justify="center">
        <v-text-field
          label="WEBVPN"
          v-model="webvpnUrl"
          readonly
          placeholder="http://webvpn.swu.edu.cn/..."
        />

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              color="primary"
              v-bind="attrs"
              v-on="on"
              target="_blank"
              :href="webvpnUrl"
            >
              OPEN
            </v-btn>
          </template>
          <span>Open URL in new tab</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="primary" v-bind="attrs" v-on="on" @click="copy(webvpnUrl)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy WEBVPN URL</span>
        </v-tooltip>
      </v-row>
    </v-col>

    <v-col lg="5" xl="5" cols="12">
      <v-row>
        <p class="text--secondary text-uppercase">Common resources</p>
      </v-row>

      <v-row>
        <template v-for="resource in commonResources">
          <v-hover v-slot:default="{ hover }" :key="resource.url">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  :class="hover ? 'mr-2 mb-1 on-hover' : 'mr-2 mb-1'"
                  :href="encryptUrl(resource.url)"
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  label
                >
                  {{ resource.name }}
                  <v-icon small right color="primary">mdi-open-in-new</v-icon>
                </v-chip>
              </template>
              <span>{{ resource.url }}</span>
            </v-tooltip>
          </v-hover>
        </template>
      </v-row>

      <v-snackbar v-model="snackbarCopy" max-width="100" rounded top timeout="2000">
        <v-icon color="success">mdi-check</v-icon> {{ snackbarCopyNote }}
      </v-snackbar>
      <v-snackbar v-model="snackbarNoInput" max-width="100" rounded top timeout="2000">
        <v-icon color="warning">mdi-alert</v-icon> You'll need to specify a URL first.
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { convert } from './convert'

export default Vue.extend({
  name: 'Converter',

  data: () => ({
    snackbarCopy: false,
    snackbarCopyNote: 'Copied to clipboard!',
    snackbarNoInput: false,

    originalUrl: '',
    webvpnUrl: '',

    commonResources: [
      {
        name: '办事大厅',
        url: 'http://i.swu.edu.cn'
      },
      {
        name: '教务系统',
        url: 'http://jw.swu.edu.cn/sso/zllogin'
      },
      {
        name: '馆藏书刊查询系统',
        url: 'http://opac.lib.swu.edu.cn:8080'
      },
      {
        name: '校园卡查询系统',
        url: 'http://ecard.swu.edu.cn'
      },
      {
        name: '学生用能查询系统',
        url: 'http://211.83.23.198'
      },
      {
        name: '校园网自助服务系统',
        url: 'http://service2.swu.edu.cn/selfservice/'
      },
      {
        name: '网费充值',
        url: 'http://service.swu.edu.cn/fee/user_cz.jsp'
      },
      {
        name: '综合考评和评优评奖系统',
        url: 'http://ehallxgdt.swu.edu.cn'
      },
      {
        name: '本科毕业生就业方案编制系统',
        url: 'http://222.198.125.203/jyzx/'
      },
      {
        name: '“贯通式”心理育人智慧平台',
        url: 'http://xljk.swu.edu.cn'
      },
      {
        name: '安全教育考试系统',
        url: 'http://aqjy.swu.edu.cn'
      },
      {
        name: '实验室安全考试系统',
        url: 'http://172.18.5.26'
      },
      {
        name: '名著阅读选书系统',
        url: 'http://222.198.126.215:8080/mzyd/'
      },
      {
        name: '软件正版化服务平台',
        url: 'http://ms.swu.edu.cn'
      },
      {
        name: '计信院实验报告上传FTP',
        url: 'http://172.18.5.102'
      }
    ]
  }),

  methods: {
    convert (): void {
      const originalUrl = this.originalUrl
      if (originalUrl === '') {
        this.snackbarNoInput = !this.snackbarNoInput
      } else {
        this.webvpnUrl = this.encryptUrl(originalUrl)
      }
    },

    encryptUrl (url: string): string {
      return `http://webvpn.swu.edu.cn${convert(url)}`
    },

    clearInputUrl (): void {
      this.originalUrl = ''
    },

    copy (value: string): void {
      if (this.webvpnUrl === '') {
        value = 'http://webvpn.swu.edu.cn'
        this.snackbarCopyNote = 'Default WEBVPN URL copied!'
      }
      console.log('Copied value:', value);
      // eslint-disable-next-line
      (this as any).$clipboard(value);
      this.snackbarCopy = !this.snackbarCopy
    }
  }
})
</script>

<style scoped>
.v-chip {
  transition: all 0.2s ease-in-out;
}

.v-chip.on-hover {
  border: thin solid var(--v-primary-base);
}
</style>
