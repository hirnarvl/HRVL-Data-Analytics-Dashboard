import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Building2, MapPin, Calendar, Activity, Database } from 'lucide-react';
import { HARARGHE_WOREDAS } from '../data/woredas';
import { DiseaseName, LivestockSpecies, RiskLevel, SurveillanceRecord, ZoneName } from '../types';

interface NewArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (rec: SurveillanceRecord) => void;
}

export const NewArrivalModal: React.FC<NewArrivalModalProps> = ({
  isOpen,
  onClose,
  onAddRecord
}) => {
  const [woredaName, setWoredaName] = useState('Haramaya');
  const [disease, setDisease] = useState<string>('Foot-and-Mouth Disease (FMD)');
  const [species, setSpecies] = useState<string>('Cattle');
  const [cases, setCases] = useState<number>(10);
  const [deaths, setDeaths] = useState<number>(1);
  const [risk, setRisk] = useState<RiskLevel>('High');
  const [isZeroReport, setIsZeroReport] = useState<boolean>(false);
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reporter, setReporter] = useState<string>('Vet Tech Mohammed');
  const [phone, setPhone] = useState<string>('+251915443322');
  const [comment, setComment] = useState<string>('Field arrival entry logged at Hirna Regional Lab.');

  if (!isOpen) return null;

  const selectedWoredaObj = HARARGHE_WOREDAS.find(w => w.name === woredaName) || HARARGHE_WOREDAS[0];
  const detectedZone: ZoneName = selectedWoredaObj.zone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRec: SurveillanceRecord = {
      id: `SR-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: dateStr,
      timestamp: new Date(dateStr).getTime(),
      woreda: woredaName,
      zone: detectedZone,
      lat: selectedWoredaObj.lat,
      lng: selectedWoredaObj.lng,
      disease: isZeroReport ? 'None (Zero Reporting)' : disease,
      species: isZeroReport ? 'None' : species,
      cases: isZeroReport ? 0 : Number(cases),
      deaths: isZeroReport ? 0 : Number(deaths),
      risk: isZeroReport ? 'Low' : risk,
      comment,
      reporter,
      phone,
      isZeroReport
    };

    onAddRecord(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 relative transition-colors">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Log Field Arrival / Surveillance Record
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hirna Regional Veterinary Laboratory Surveillance Panel • Entries cached automatically for field connectivity gaps
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Zero Report Checkbox */}
          <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
            <input
              type="checkbox"
              id="zeroReportCheck"
              checked={isZeroReport}
              onChange={e => setIsZeroReport(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="zeroReportCheck" className="font-bold cursor-pointer">
              Log as Zero Reporting Submission (No Outbreak / 0 Cases)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Woreda Selector */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Woreda (Hararghe 36 Woredas)
              </label>
              <select
                value={woredaName}
                onChange={e => setWoredaName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
              >
                <optgroup label="E/H (21 Woredas)">
                  {HARARGHE_WOREDAS.filter(w => w.zone === 'E/H').map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </optgroup>
                <optgroup label="W/H (15 Woredas)">
                  {HARARGHE_WOREDAS.filter(w => w.zone === 'W/H').map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Auto-Detected Zone */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detected Zone
              </label>
              <input
                type="text"
                readOnly
                value={detectedZone}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Observation Date
              </label>
              <input
                type="date"
                required
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Epidemiological Risk
              </label>
              <select
                disabled={isZeroReport}
                value={risk}
                onChange={e => setRisk(e.target.value as RiskLevel)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>

            {/* Disease */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Disease
              </label>
              <select
                disabled={isZeroReport}
                value={disease}
                onChange={e => setDisease(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="Foot-and-Mouth Disease (FMD)">Foot-and-Mouth Disease (FMD)</option>
                <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
                <option value="Peste des Petits Ruminants (PPR)">Peste des Petits Ruminants (PPR)</option>
                <option value="Contagious Bovine Pleuropneumonia (CBPP)">Contagious Bovine Pleuropneumonia (CBPP)</option>
                <option value="African Horse Sickness (AHS)">African Horse Sickness (AHS)</option>
                <option value="Anthrax">Anthrax</option>
                <option value="Rabies">Rabies</option>
                <option value="Newcastle Disease (ND)">Newcastle Disease (ND)</option>
              </select>
            </div>

            {/* Species */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Affected Species
              </label>
              <select
                disabled={isZeroReport}
                value={species}
                onChange={e => setSpecies(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="Cattle">Cattle</option>
                <option value="Goats">Goats</option>
                <option value="Sheep">Sheep</option>
                <option value="Poultry">Poultry</option>
                <option value="Equines">Equines</option>
                <option value="Camels">Camels</option>
                <option value="Swine / Others">Swine / Others</option>
              </select>
            </div>

            {/* Cases */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Number of Cases
              </label>
              <input
                type="number"
                disabled={isZeroReport}
                min={0}
                value={isZeroReport ? 0 : cases}
                onChange={e => setCases(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Deaths */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Number of Fatalities
              </label>
              <input
                type="number"
                disabled={isZeroReport}
                min={0}
                value={isZeroReport ? 0 : deaths}
                onChange={e => setDeaths(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-rose-600 focus:outline-none disabled:opacity-50"
              />
            </div>

          </div>

          {/* Reporter info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Field Reporter Name
              </label>
              <input
                type="text"
                value={reporter}
                onChange={e => setReporter(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Field Observations & Clinical Notes
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
            >
              Submit Field Record
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
