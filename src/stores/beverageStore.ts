import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    async init() {
      // Load bases from Firestore
      const basesSnapshot = await getDocs(collection(db, "bases"));
      this.bases = basesSnapshot.docs.map(doc => doc.data() as BaseBeverageType);

      // Load creamers from Firestore
      const creamersSnapshot = await getDocs(collection(db, "creamers"));
      this.creamers = creamersSnapshot.docs.map(doc => doc.data() as CreamerType);

      // Load syrups from Firestore
      const syrupsSnapshot = await getDocs(collection(db, "syrups"));
      this.syrups = syrupsSnapshot.docs.map(doc => doc.data() as SyrupType);

      // Set default values
      this.currentBase = this.bases[0] || null;
      this.currentCreamer = this.creamers[0] || null;
      this.currentSyrup = this.syrups[0] || null;

      // Set up real-time listener for beverages
      onSnapshot(collection(db, "beverages"), (snapshot) => {
        this.beverages = snapshot.docs.map(doc => doc.data() as BeverageType);
      });
    },

    async makeBeverage() {
      if (!this.currentBase || !this.currentCreamer || !this.currentSyrup || !this.currentName.trim()) {
        return;
      }

      const newBeverage: BeverageType = {
        id: Date.now().toString(),
        name: this.currentName,
        temp: this.currentTemp,
        base: this.currentBase,
        syrup: this.currentSyrup,
        creamer: this.currentCreamer,
      };

      // Save to Firestore
      await setDoc(doc(db, "beverages", newBeverage.id), newBeverage);
      this.currentName = "";
    },

    showBeverage(beverage: BeverageType) {
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentSyrup = beverage.syrup;
      this.currentCreamer = beverage.creamer;
      this.currentBeverage = beverage;
    },
  },
});
