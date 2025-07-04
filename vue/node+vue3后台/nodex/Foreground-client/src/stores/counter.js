import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const PublishLength = ref(0)
  const SecretLength = ref(0)
  const Collectionslength = ref(0)

  function setPublishLength(length) {
    PublishLength.value = length
  }
  function setSecretLength(length) {
    SecretLength.value = length
  }
  function setcollectionslength(length) {
    Collectionslength.value = length
  }



  return { PublishLength, setPublishLength, SecretLength, setSecretLength, Collectionslength, setcollectionslength }
})
