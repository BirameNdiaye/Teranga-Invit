'use client'

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import { Icon } from './Icon'

const steps = [
  { id: 1, label: 'Informations', icon: 'calendar' as const },
  { id: 2, label: 'Médias', icon: 'image' as const },
  { id: 3, label: 'Design', icon: 'palette' as const },
  { id: 4, label: 'Révision', icon: 'review' as const },
  { id: 5, label: 'Partage', icon: 'globe' as const },
]

const defaultPhoto =
  'https://images.unsplash.com/photo-1696076994764-a3f679d74d95?auto=format&fit=crop&w=1200&q=86'

const themes = [
  {
    id: 'sauge',
    name: 'Sauge intemporelle',
    description: 'Naturel et délicat',
    colors: ['#284D3B', '#B6955D', '#F3EBDD'],
    overlay: 'from-[#10271c]/20 via-[#10271c]/10 to-[#10271c]/90',
    button: '#F0E6D3',
    buttonText: '#294335',
    accent: '#E5C88F',
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux royal',
    description: 'Profond et sophistiqué',
    colors: ['#5D1E2C', '#D2A968', '#F6ECE7'],
    overlay: 'from-[#3d111a]/15 via-[#3d111a]/10 to-[#3d111a]/92',
    button: '#F4E2D1',
    buttonText: '#5D1E2C',
    accent: '#E7BB75',
  },
  {
    id: 'dore',
    name: 'Or de Dakar',
    description: 'Lumineux et cérémonial',
    colors: ['#3D3323', '#C29A52', '#FFF8E9'],
    overlay: 'from-[#332815]/15 via-[#332815]/5 to-[#332815]/90',
    button: '#E8C985',
    buttonText: '#3D3323',
    accent: '#F2D28B',
  },
  {
    id: 'minimal',
    name: 'Ivoire moderne',
    description: 'Épuré et éditorial',
    colors: ['#242925', '#A9B3A9', '#F7F5EE'],
    overlay: 'from-black/10 via-black/5 to-black/80',
    button: '#F7F5EE',
    buttonText: '#242925',
    accent: '#D8DED8',
  },
]

type FormState = {
  title: string
  firstName: string
  secondName: string
  date: string
  startTime: string
  ceremonyTypes: string[]
  venue: string
  address: string
  message: string
}

type MediaItem = { name: string; url: string }

export default function InvitationBuilder() {
  const [step, setStep] = useState(1)
  const [preview, setPreview] = useState(true)
  const [form, setForm] = useState<FormState>({
    title: 'Notre mariage',
    firstName: 'Ada',
    secondName: 'Maty',
    date: '2026-12-19',
    startTime: '16:00',
    ceremonyTypes: ['Civile', 'Réception'],
    venue: 'King Fahd Palace',
    address: 'Pointe des Almadies, Dakar',
    message: 'Entourés de nos familles, nous avons la joie de vous convier à célébrer notre union.',
  })
  const [cover, setCover] = useState<MediaItem>({
    name: 'couverture-mariage.jpg',
    url: defaultPhoto,
  })
  const [gallery, setGallery] = useState<MediaItem[]>([])
  const [audioName, setAudioName] = useState('')
  const [videoURL, setVideoURL] = useState('')
  const [mediaError, setMediaError] = useState('')
  const [themeId, setThemeId] = useState('sauge')
  const [fontPair, setFontPair] = useState('cormorant')
  const [heroLayout, setHeroLayout] = useState('centered')
  const [animations, setAnimations] = useState(true)
  const [overlay, setOverlay] = useState(62)
  const [visibility, setVisibility] = useState('public')
  const [accessCode, setAccessCode] = useState('')
  const [slug, setSlug] = useState('ada-et-maty')
  const [published, setPublished] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareMessage, setShareMessage] = useState(
    'Nous avons la joie de vous inviter à notre mariage. Découvrez tous les détails ici :',
  )

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]
  const invitationURL = `https://terangainvit.com/${slug || 'ada-et-maty'}`
  const dateLabel = useMemo(() => {
    if (!form.date) return 'À définir'
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${form.date}T12:00:00`))
  }, [form.date])

  const completedFields = [
    form.title,
    form.firstName,
    form.secondName,
    form.date,
    form.startTime,
    form.ceremonyTypes.length ? 'selected' : '',
    form.venue,
    form.address,
  ].filter(Boolean).length
  const isComplete = completedFields === 8

  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const toggleCeremony = (choice: string) =>
    setForm((current) => ({
      ...current,
      ceremonyTypes: current.ceremonyTypes.includes(choice)
        ? current.ceremonyTypes.filter((item) => item !== choice)
        : [...current.ceremonyTypes, choice],
    }))

  const onCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 40_000_000) {
      setMediaError('La couverture doit être une image JPG, PNG ou WebP de 40 Mo maximum.')
      return
    }
    setMediaError('')
    setCover({ name: file.name, url: URL.createObjectURL(file) })
  }

  const onGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    const valid = files.filter(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 40_000_000,
    )
    if (valid.length !== files.length) {
      setMediaError('Certaines images ont été ignorées : vérifiez le format et la limite de 40 Mo.')
    } else {
      setMediaError('')
    }
    setGallery((current) =>
      [
        ...current,
        ...valid.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
      ].slice(0, 12),
    )
  }

  const onAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['audio/mpeg', 'audio/aac', 'audio/x-aac'].includes(file.type) || file.size > 10_000_000) {
      setMediaError('La musique doit être un fichier MP3 ou AAC de 10 Mo maximum.')
      return
    }
    setMediaError('')
    setAudioName(file.name)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(invitationURL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${form.firstName} & ${form.secondName}`,
          text: shareMessage,
          url: invitationURL,
        })
      } else {
        await copyLink()
      }
    } catch {
      // Closing the native share sheet is an expected user action.
    }
  }

  const shareTo = (
    network: 'whatsapp' | 'facebook' | 'telegram' | 'instagram' | 'sms' | 'email',
  ) => {
    const text = encodeURIComponent(`${shareMessage} ${invitationURL}`)
    const url = encodeURIComponent(invitationURL)
    if (network === 'instagram') {
      void navigator.clipboard?.writeText(invitationURL)
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
      return
    }
    const links = {
      whatsapp: `https://wa.me/?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(shareMessage)}`,
      sms: `sms:?&body=${text}`,
      email: `mailto:?subject=${encodeURIComponent(`Invitation au mariage de ${form.firstName} et ${form.secondName}`)}&body=${text}`,
    }
    window.open(links[network], '_blank', 'noopener,noreferrer')
  }

  const goNext = () => {
    if (step === 4) {
      setPublished(true)
      setStep(5)
      return
    }
    setStep((current) => Math.min(5, current + 1))
  }

  return (
    <main className="min-h-screen bg-[#F7F6F1] text-[#21322A]">
      <Header published={published} />
      <Progress step={step} setStep={setStep} />

      <div
        className={`mx-auto grid max-w-[1450px] gap-7 px-4 py-8 md:px-8 lg:py-10 ${
          preview ? 'lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_500px]' : ''
        }`}
      >
        <section className="min-w-0">
          <StepHeading step={step} preview={preview} setPreview={setPreview} />

          {step === 1 && (
            <InformationStep form={form} update={update} toggleCeremony={toggleCeremony} />
          )}
          {step === 2 && (
            <MediaStep
              cover={cover}
              gallery={gallery}
              audioName={audioName}
              videoURL={videoURL}
              error={mediaError}
              onCoverChange={onCoverChange}
              onGalleryChange={onGalleryChange}
              onAudioChange={onAudioChange}
              setGallery={setGallery}
              setAudioName={setAudioName}
              setVideoURL={setVideoURL}
            />
          )}
          {step === 3 && (
            <DesignStep
              themeId={themeId}
              setThemeId={setThemeId}
              fontPair={fontPair}
              setFontPair={setFontPair}
              heroLayout={heroLayout}
              setHeroLayout={setHeroLayout}
              animations={animations}
              setAnimations={setAnimations}
              overlay={overlay}
              setOverlay={setOverlay}
            />
          )}
          {step === 4 && (
            <ReviewStep
              form={form}
              cover={cover}
              galleryCount={gallery.length}
              audioName={audioName}
              themeName={theme.name}
              visibility={visibility}
              setVisibility={setVisibility}
              accessCode={accessCode}
              setAccessCode={setAccessCode}
              slug={slug}
              setSlug={setSlug}
              isComplete={isComplete}
              setStep={setStep}
            />
          )}
          {step === 5 && (
            <ShareStep
              published={published}
              form={form}
              invitationURL={invitationURL}
              shareMessage={shareMessage}
              setShareMessage={setShareMessage}
              copied={copied}
              copyLink={copyLink}
              nativeShare={nativeShare}
              shareTo={shareTo}
              publish={() => setPublished(true)}
            />
          )}

          {step < 5 && (
            <StepActions
              step={step}
              isComplete={isComplete}
              onPrevious={() => setStep((current) => Math.max(1, current - 1))}
              onNext={goNext}
            />
          )}
        </section>

        {preview && (
          <LivePreview
            form={form}
            coverURL={cover.url}
            dateLabel={dateLabel}
            theme={theme}
            fontPair={fontPair}
            heroLayout={heroLayout}
            overlay={overlay}
            animations={animations}
            published={published}
          />
        )}
      </div>
    </main>
  )
}

function Header({ published }: { published: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#D9DED7] bg-[#FCFCF8]/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D6DED5] bg-white text-[#315947]"
          aria-label="Retour au tableau de bord"
        >
          <Icon name="back" className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[20px] font-semibold leading-none text-[#1E3027]">
              Ada & Maty
            </h1>
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${published ? 'bg-[#E4EFE7] text-[#346246]' : 'bg-[#ECEBE3] text-[#6D746D]'}`}
            >
              {published ? 'Publiée' : 'Brouillon'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#788079]">Création de votre invitation</p>
        </div>
      </div>
      <div className="logo-lockup" aria-label="Teranga Invit">
        <span className="brand-mark">
          <span />
          <span />
        </span>
        <span className="hidden font-display text-[22px] font-semibold tracking-[-.02em] text-[#18372A] sm:block">
          Teranga Invit
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 text-xs text-[#7B827D] lg:flex">
          <Icon name="check" className="h-4 w-4 text-[#759281]" /> Enregistré à l’instant
        </div>
        <button className="flex h-11 items-center gap-2 rounded-full border border-[#D6DDD6] bg-white px-4 text-sm font-semibold text-[#294B3A] shadow-sm">
          <Icon name="help" className="h-4 w-4" />
          <span className="hidden sm:inline">Aide</span>
        </button>
      </div>
    </header>
  )
}

function Progress({ step, setStep }: { step: number; setStep: (value: number) => void }) {
  return (
    <section className="border-b border-[#D9DED7] bg-[#FCFCF8] px-4 py-4 md:px-8">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold">
          <span className="text-[#2C503D]">Étape {step} sur 5</span>
          <span className="text-[#89908A]">{step * 20}% complété</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#E4E7E1]">
          <div
            className="h-full rounded-full bg-[#B39054] transition-all duration-500"
            style={{ width: `${step * 20}%` }}
          />
        </div>
        <nav
          className="mt-4 flex items-center justify-between gap-1 overflow-x-auto"
          aria-label="Étapes de création"
        >
          {steps.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`group flex min-w-max items-center gap-2 text-xs font-semibold transition ${item.id === step ? 'text-[#234B38]' : item.id < step ? 'text-[#76867A]' : 'text-[#A0A6A1]'}`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border transition ${item.id === step ? 'border-[#305C45] bg-[#305C45] text-white shadow-[0_4px_14px_rgba(48,92,69,.2)]' : item.id < step ? 'border-[#A7B8AB] bg-[#E8EFE9] text-[#496854]' : 'border-[#D8DDD7] bg-white'}`}
              >
                {item.id < step ? (
                  <Icon name="check" className="h-4 w-4" />
                ) : (
                  <Icon name={item.icon} className="h-4 w-4" />
                )}
              </span>
              <span className="hidden md:block">{item.label}</span>
              {index < steps.length - 1 && (
                <span className="hidden h-px w-8 bg-[#D8DDD7] xl:block" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}

const stepHeadings = {
  1: [
    'Commençons par l’essentiel',
    'Parlez-nous de votre grand jour',
    'Ces informations apparaîtront sur votre invitation. Vous pourrez tout modifier à tout moment.',
  ],
  2: [
    'Donnez vie à votre histoire',
    'Ajoutez vos plus beaux souvenirs',
    'Choisissez une couverture, une galerie et une ambiance sonore adaptées à vos invités.',
  ],
  3: [
    'Une invitation à votre image',
    'Composez votre univers visuel',
    'Sélectionnez un thème harmonieux puis ajustez la typographie, la mise en page et les animations.',
  ],
  4: [
    'Dernière vérification',
    'Tout est prêt pour le grand jour',
    'Relisez les informations, choisissez votre adresse et définissez qui pourra voir votre invitation.',
  ],
  5: [
    'Votre invitation est prête',
    'Invitez avec le cœur',
    'Partagez votre lien sur vos canaux préférés et suivez les confirmations de vos invités.',
  ],
} as const

function StepHeading({
  step,
  preview,
  setPreview,
}: {
  step: number
  preview: boolean
  setPreview: (value: boolean) => void
}) {
  const [eyebrow, title, description] = stepHeadings[step as keyof typeof stepHeadings]
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#A07C3D]">
          <Icon name="sparkle" className="h-4 w-4" /> {eyebrow}
        </p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-.035em] text-[#1C3126]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#717A73]">{description}</p>
      </div>
      <button
        onClick={() => setPreview(!preview)}
        className="hidden h-11 shrink-0 items-center gap-2 rounded-full border border-[#D4DCD4] bg-white px-4 text-sm font-semibold text-[#315540] shadow-sm lg:flex"
      >
        <Icon name="preview" className="h-4 w-4" /> {preview ? 'Masquer' : 'Afficher'} l’aperçu
      </button>
    </div>
  )
}

function InformationStep({
  form,
  update,
  toggleCeremony,
}: {
  form: FormState
  update: (key: keyof FormState, value: string) => void
  toggleCeremony: (choice: string) => void
}) {
  return (
    <Card
      icon="heart"
      title="Votre célébration"
      subtitle="Les champs marqués d’un astérisque sont requis."
    >
      <div className="space-y-6">
        <Field label="Titre de l’invitation" required hint="Ex. Ada & Maty se marient">
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="input"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Premier prénom" required>
            <input
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Second prénom" required>
            <input
              value={form.secondName}
              onChange={(e) => update('secondName', e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field label="Type de cérémonie" required>
          <div className="flex flex-wrap gap-2">
            {['Religieuse', 'Civile', 'Réception', 'Dot', 'Autre'].map((choice) => {
              const selected = form.ceremonyTypes.includes(choice)
              return (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleCeremony(choice)}
                  className={`h-11 rounded-full border px-4 text-sm font-semibold transition ${
                    selected
                      ? 'border-[#557866] bg-[#EAF0EB] text-[#315743] shadow-[0_4px_12px_rgba(49,87,67,.08)]'
                      : 'border-[#DADFD9] bg-white text-[#737B74] hover:border-[#9BAC9F] hover:text-[#40594A]'
                  }`}
                >
                  {selected && <Icon name="check" className="mr-2 inline h-4 w-4" />}
                  {choice}
                </button>
              )
            })}
          </div>
          {form.ceremonyTypes.length === 0 && (
            <span className="mt-2 block text-xs font-semibold text-[#985E48]">
              Sélectionnez au moins un type de cérémonie.
            </span>
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date" required>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Début" required>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => update('startTime', e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom du lieu" required>
            <input
              value={form.venue}
              onChange={(e) => update('venue', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Adresse" required>
            <input
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field label="Message d’accueil" counter={`${form.message.length}/500`}>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value.slice(0, 500))}
            className="input min-h-28 resize-none py-3"
          />
        </Field>
      </div>
    </Card>
  )
}

function MediaStep(props: {
  cover: MediaItem
  gallery: MediaItem[]
  audioName: string
  videoURL: string
  error: string
  onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void
  onGalleryChange: (event: ChangeEvent<HTMLInputElement>) => void
  onAudioChange: (event: ChangeEvent<HTMLInputElement>) => void
  setGallery: (items: MediaItem[]) => void
  setAudioName: (value: string) => void
  setVideoURL: (value: string) => void
}) {
  return (
    <div className="space-y-5">
      {props.error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#D8A89A] bg-[#FFF4F0] px-4 py-3 text-sm text-[#8A4938]"
        >
          {props.error}
        </div>
      )}
      <Card
        icon="image"
        title="Photo de couverture"
        subtitle="Cette image occupera le premier écran de votre invitation."
      >
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <img
            src={props.cover.url}
            alt="Aperçu de la couverture"
            className="h-44 w-full rounded-2xl object-cover"
          />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold text-[#31453A]">{props.cover.name}</p>
            <p className="mt-1 text-xs leading-5 text-[#858E87]">
              JPG, PNG ou WebP · 40 Mo maximum · format vertical conseillé
            </p>
            <label className="mt-4 flex h-11 w-fit cursor-pointer items-center gap-2 rounded-full border border-[#C7D2C9] bg-white px-5 text-sm font-bold text-[#315743]">
              <Icon name="image" className="h-4 w-4" /> Remplacer la photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={props.onCoverChange}
              />
            </label>
          </div>
        </div>
      </Card>
      <Card
        icon="image"
        title="Galerie photo"
        subtitle={`${props.gallery.length}/12 images ajoutées`}
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {props.gallery.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  props.setGallery(props.gallery.filter((_, itemIndex) => itemIndex !== index))
                }
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/65 text-white opacity-0 transition group-hover:opacity-100"
                aria-label={`Supprimer ${item.name}`}
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {props.gallery.length < 12 && (
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-dashed border-[#AEBDB1] bg-[#F5F7F3] text-center text-[#57705F]">
              <span>
                <Icon name="plus" className="mx-auto h-5 w-5" />
                <span className="mt-1 block text-[10px] font-bold">Ajouter</span>
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={props.onGalleryChange}
              />
            </label>
          )}
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card
          icon="music"
          title="Musique d’ambiance"
          subtitle="La lecture sera lancée par l’invité."
        >
          {props.audioName ? (
            <div className="flex items-center justify-between rounded-2xl bg-[#EFF3EE] p-4">
              <div>
                <p className="text-sm font-bold text-[#314B3D]">{props.audioName}</p>
                <p className="mt-1 text-xs text-[#7B887F]">Prête à être lue</p>
              </div>
              <button
                onClick={() => props.setAudioName('')}
                className="text-[#8A5A4A]"
                aria-label="Supprimer la musique"
              >
                <Icon name="trash" className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#B7C2B9] bg-[#F8F9F6] text-sm font-bold text-[#496554]">
              <Icon name="music" className="mb-2 h-5 w-5" /> Ajouter un MP3 ou AAC
              <input
                type="file"
                accept="audio/mpeg,audio/aac"
                className="sr-only"
                onChange={props.onAudioChange}
              />
            </label>
          )}
        </Card>
        <Card icon="video" title="Vidéo" subtitle="YouTube ou Vimeo, 60 secondes conseillées.">
          <Field label="Lien de la vidéo">
            <input
              value={props.videoURL}
              onChange={(e) => props.setVideoURL(e.target.value)}
              placeholder="https://youtube.com/..."
              className="input"
            />
          </Field>
          <p className="mt-3 text-xs text-[#89918B]">
            La vidéo sera intégrée sans lecture automatique du son.
          </p>
        </Card>
      </div>
    </div>
  )
}

function DesignStep(props: {
  themeId: string
  setThemeId: (value: string) => void
  fontPair: string
  setFontPair: (value: string) => void
  heroLayout: string
  setHeroLayout: (value: string) => void
  animations: boolean
  setAnimations: (value: boolean) => void
  overlay: number
  setOverlay: (value: number) => void
}) {
  return (
    <div className="space-y-5">
      <Card
        icon="palette"
        title="Choisissez un thème"
        subtitle="Chaque thème applique une palette harmonieuse à toute l’invitation."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => props.setThemeId(theme.id)}
              className={`rounded-2xl border-2 p-4 text-left transition ${props.themeId === theme.id ? 'border-[#315A45] bg-[#F1F5F1] shadow-[0_8px_24px_rgba(49,90,69,.1)]' : 'border-[#E1E5DF] bg-white hover:border-[#AEBDB1]'}`}
            >
              <div className="mb-4 flex h-24 overflow-hidden rounded-xl">
                {theme.colors.map((color, index) => (
                  <span
                    key={color}
                    className="h-full flex-1"
                    style={{ backgroundColor: color, flexGrow: index === 0 ? 2 : 1 }}
                  />
                ))}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-xl font-semibold text-[#263B30]">{theme.name}</p>
                  <p className="mt-1 text-xs text-[#7F8981]">{theme.description}</p>
                </div>
                {props.themeId === theme.id && (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#315A45] text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card icon="review" title="Typographie" subtitle="Des associations lisibles et élégantes.">
          <div className="space-y-2">
            {[
              ['cormorant', 'Cormorant & Manrope'],
              ['classic', 'Playfair & Inter'],
              ['modern', 'Lora & Poppins'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => props.setFontPair(id)}
                className={`flex h-14 w-full items-center justify-between rounded-xl border px-4 text-left ${props.fontPair === id ? 'border-[#557866] bg-[#EEF3EF]' : 'border-[#E0E4DF]'}`}
              >
                <span
                  className={id === 'cormorant' ? 'font-display text-lg' : 'text-sm font-semibold'}
                >
                  {label}
                </span>
                {props.fontPair === id && <Icon name="check" className="h-4 w-4 text-[#315A45]" />}
              </button>
            ))}
          </div>
        </Card>
        <Card
          icon="preview"
          title="Mise en page du hero"
          subtitle="Choisissez la position du contenu."
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              ['centered', 'Centrée'],
              ['bottom', 'En bas'],
              ['editorial', 'Éditoriale'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => props.setHeroLayout(id)}
                className={`aspect-[4/5] rounded-xl border p-2 text-[10px] font-bold ${props.heroLayout === id ? 'border-[#557866] bg-[#EAF0EB] text-[#315743]' : 'border-[#DDE2DC] bg-[#F6F4EE] text-[#747D76]'}`}
              >
                <span
                  className={`flex h-full rounded-lg bg-[#BCC7BD] p-2 ${id === 'centered' ? 'items-center justify-center text-center' : id === 'bottom' ? 'items-end justify-center text-center' : 'items-end justify-start text-left'}`}
                >
                  <span className="h-5 w-10 rounded-sm bg-white/75" />
                </span>
                <span className="mt-2 block">{label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card icon="sparkle" title="Finitions" subtitle="Ajustez le contraste et le mouvement.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={`Intensité de l’overlay · ${props.overlay}%`}>
            <input
              type="range"
              min="25"
              max="85"
              value={props.overlay}
              onChange={(e) => props.setOverlay(Number(e.target.value))}
              className="mt-3 w-full accent-[#315A45]"
            />
          </Field>
          <label className="flex items-center justify-between rounded-2xl border border-[#DEE3DD] p-4">
            <span>
              <span className="block text-sm font-bold">Animations romantiques</span>
              <span className="mt-1 block text-xs text-[#828B84]">
                Pétales, halos et transitions douces
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={props.animations}
              onClick={() => props.setAnimations(!props.animations)}
              className={`relative h-7 w-12 rounded-full transition ${props.animations ? 'bg-[#315A45]' : 'bg-[#C7CEC8]'}`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${props.animations ? 'left-6' : 'left-1'}`}
              />
            </button>
          </label>
        </div>
      </Card>
    </div>
  )
}

function ReviewStep(props: {
  form: FormState
  cover: MediaItem
  galleryCount: number
  audioName: string
  themeName: string
  visibility: string
  setVisibility: (value: string) => void
  accessCode: string
  setAccessCode: (value: string) => void
  slug: string
  setSlug: (value: string) => void
  isComplete: boolean
  setStep: (value: number) => void
}) {
  const summaries = [
    {
      step: 1,
      icon: 'calendar' as const,
      title: 'Informations',
      text: `${props.form.firstName} & ${props.form.secondName} · ${props.form.date} · ${props.form.venue}`,
    },
    {
      step: 2,
      icon: 'image' as const,
      title: 'Médias',
      text: `Couverture ajoutée · ${props.galleryCount} photo${props.galleryCount > 1 ? 's' : ''} · ${props.audioName || 'Sans musique'}`,
    },
    {
      step: 3,
      icon: 'palette' as const,
      title: 'Design',
      text: `${props.themeName} · Animations activées`,
    },
  ]
  return (
    <div className="space-y-5">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${props.isComplete ? 'border-[#B8CEBC] bg-[#EDF6EF] text-[#315A40]' : 'border-[#E1BE9F] bg-[#FFF7EE] text-[#805A38]'}`}
      >
        <span
          className={`grid h-9 w-9 place-items-center rounded-full ${props.isComplete ? 'bg-[#D6E9DA]' : 'bg-[#F5DFC9]'}`}
        >
          <Icon name={props.isComplete ? 'check' : 'help'} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold">
            {props.isComplete ? 'Votre invitation est complète' : 'Quelques informations manquent'}
          </p>
          <p className="mt-0.5 text-xs opacity-75">
            {props.isComplete
              ? 'Tous les champs requis sont prêts pour la publication.'
              : 'Revenez aux informations avant de publier.'}
          </p>
        </div>
      </div>
      <Card
        icon="review"
        title="Récapitulatif"
        subtitle="Vérifiez chaque section avant de publier."
      >
        <div className="divide-y divide-[#E4E7E2]">
          {summaries.map((item) => (
            <div key={item.step} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF2ED] text-[#456451]">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{item.title}</p>
                <p className="mt-1 truncate text-xs text-[#7A847C]">{item.text}</p>
              </div>
              <button
                onClick={() => props.setStep(item.step)}
                className="text-xs font-bold text-[#886A37]"
              >
                Modifier
              </button>
            </div>
          ))}
        </div>
      </Card>
      <Card
        icon="globe"
        title="Adresse et visibilité"
        subtitle="Définissez le lien et les conditions d’accès."
      >
        <Field label="Lien personnalisé">
          <div className="flex rounded-2xl border border-[#D8DED7] bg-white focus-within:border-[#557866]">
            <span className="hidden items-center border-r border-[#E1E5E0] px-4 text-sm text-[#89918B] sm:flex">
              terangainvit.com/
            </span>
            <input
              value={props.slug}
              onChange={(e) =>
                props.setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
              }
              className="min-h-12 min-w-0 flex-1 rounded-2xl px-4 text-sm outline-none"
            />
          </div>
        </Field>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['public', 'globe', 'Publique', 'Toute personne avec le lien'],
            ['code', 'lock', 'Avec un code', 'Un code sera demandé'],
            ['private', 'users', 'Invités nommés', 'Liste privée uniquement'],
          ].map(([id, icon, title, text]) => (
            <button
              key={id}
              onClick={() => props.setVisibility(id)}
              className={`rounded-2xl border p-4 text-left ${props.visibility === id ? 'border-[#557866] bg-[#EDF3EE]' : 'border-[#DEE3DD]'}`}
            >
              <Icon name={icon as 'globe'} className="mb-3 h-5 w-5 text-[#456552]" />
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#7E8880]">{text}</p>
            </button>
          ))}
        </div>
        {props.visibility === 'code' && (
          <div className="mt-5">
            <Field label="Code d’accès">
              <input
                value={props.accessCode}
                onChange={(e) => props.setAccessCode(e.target.value.slice(0, 12))}
                placeholder="Ex. AM2026"
                className="input"
              />
            </Field>
          </div>
        )}
      </Card>
    </div>
  )
}

function ShareStep(props: {
  published: boolean
  form: FormState
  invitationURL: string
  shareMessage: string
  setShareMessage: (value: string) => void
  copied: boolean
  copyLink: () => Promise<void>
  nativeShare: () => Promise<void>
  shareTo: (network: 'whatsapp' | 'facebook' | 'telegram' | 'instagram' | 'sms' | 'email') => void
  publish: () => void
}) {
  if (!props.published) {
    return (
      <Card
        icon="globe"
        title="Publication nécessaire"
        subtitle="Publiez votre invitation avant de la partager."
      >
        <button
          onClick={props.publish}
          className="h-12 rounded-full bg-[#2C5943] px-7 text-sm font-bold text-white"
        >
          Publier maintenant
        </button>
      </Card>
    )
  }
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[28px] bg-[#294D3B] p-7 text-white md:p-9">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border border-white/15" />
        <div className="absolute -right-2 -top-6 h-36 w-36 rounded-full border border-[#D6B778]/30" />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15">
          <Icon name="check" className="h-6 w-6 text-[#E8CC92]" />
        </span>
        <h3 className="mt-5 font-display text-4xl font-semibold">Votre invitation est en ligne</h3>
        <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
          Le mariage de {props.form.firstName} et {props.form.secondName} peut maintenant être
          partagé avec vos proches.
        </p>
        <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-white/10 p-2 sm:flex-row">
          <div className="min-w-0 flex-1 truncate px-3 py-2 text-sm text-white/85">
            {props.invitationURL}
          </div>
          <button
            onClick={props.copyLink}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-[#294D3B]"
          >
            <Icon name={props.copied ? 'check' : 'copy'} className="h-4 w-4" />{' '}
            {props.copied ? 'Copié' : 'Copier le lien'}
          </button>
        </div>
      </div>
      <Card
        icon="share"
        title="Partager l’invitation"
        subtitle="Personnalisez le message avant de l’envoyer."
      >
        <Field label="Message de partage" counter={`${props.shareMessage.length}/240`}>
          <textarea
            value={props.shareMessage}
            onChange={(e) => props.setShareMessage(e.target.value.slice(0, 240))}
            className="input min-h-24 resize-none py-3"
          />
        </Field>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ['whatsapp', 'WhatsApp', '#218B59'],
            ['facebook', 'Facebook', '#3C64A7'],
            ['telegram', 'Telegram', '#3188B8'],
            ['instagram', 'Instagram', '#9A3D82'],
            ['sms', 'SMS', '#657A46'],
            ['email', 'E-mail', '#725E43'],
          ].map(([id, label, color]) => (
            <button
              key={id}
              onClick={() =>
                props.shareTo(
                  id as 'whatsapp' | 'facebook' | 'telegram' | 'instagram' | 'sms' | 'email',
                )
              }
              className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-[#DFE3DE] bg-white text-xs font-bold"
              style={{ color }}
            >
              <span
                className="mb-2 grid h-8 w-8 place-items-center rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                <Icon name={id === 'email' ? 'email' : 'share'} className="h-4 w-4" />
              </span>
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={props.nativeShare}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#BBC9BE] bg-[#F0F4F0] text-sm font-bold text-[#315743]"
        >
          <Icon name="share" className="h-5 w-5" /> Plus d’options de partage
        </button>
      </Card>
      <div className="grid gap-5 sm:grid-cols-2">
        <Card icon="review" title="QR code" subtitle="Pour vos cartons et affiches imprimés.">
          <div className="flex items-center gap-4">
            <div className="qr-placeholder grid h-24 w-24 shrink-0 place-items-center rounded-xl border-4 border-white bg-white shadow-sm">
              <span className="brand-mark scale-75">
                <span />
                <span />
              </span>
            </div>
            <button className="flex h-11 items-center gap-2 rounded-full border border-[#C8D1C9] px-4 text-xs font-bold">
              <Icon name="download" className="h-4 w-4" /> Télécharger PNG
            </button>
          </div>
        </Card>
        <Card icon="users" title="Suivi" subtitle="Les premiers chiffres apparaîtront ici.">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['0', 'Vues'],
              ['0', 'Partages'],
              ['0', 'RSVP'],
            ].map(([number, label]) => (
              <div key={label} className="rounded-xl bg-[#F0F3EF] p-3">
                <strong className="font-display text-2xl text-[#294D3B]">{number}</strong>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-[#7B867E]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function StepActions({
  step,
  isComplete,
  onPrevious,
  onNext,
}: {
  step: number
  isComplete: boolean
  onPrevious: () => void
  onNext: () => void
}) {
  const labels = [
    'Continuer vers les médias',
    'Continuer vers le design',
    'Réviser l’invitation',
    'Publier l’invitation',
  ]
  return (
    <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
      <button
        onClick={step === 1 ? undefined : onPrevious}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#D6DDD6] bg-white px-6 text-sm font-semibold text-[#405248] sm:w-auto"
      >
        <Icon name={step === 1 ? 'save' : 'back'} className="h-4 w-4" />{' '}
        {step === 1 ? 'Enregistrer et quitter' : 'Étape précédente'}
      </button>
      <button
        onClick={onNext}
        disabled={step === 4 && !isComplete}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#2C5943] px-7 text-sm font-bold text-white shadow-[0_10px_25px_rgba(44,89,67,.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
      >
        {labels[step - 1]} <Icon name="arrow" className="h-4 w-4" />
      </button>
    </div>
  )
}

function LivePreview(props: {
  form: FormState
  coverURL: string
  dateLabel: string
  theme: (typeof themes)[number]
  fontPair: string
  heroLayout: string
  overlay: number
  animations: boolean
  published: boolean
}) {
  const countdown = useCountdown(props.form.date, props.form.startTime)
  const alignment =
    props.heroLayout === 'editorial' ? 'text-left items-start' : 'text-center items-center'
  const position = props.heroLayout === 'centered' ? 'justify-center' : 'justify-end'
  return (
    <aside className="lg:sticky lg:top-[104px] lg:self-start">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8C958E]">
            Aperçu en direct
          </p>
          <p className="mt-1 text-sm text-[#5B6960]">Vue mobile · {props.theme.name}</p>
        </div>
        <span className="rounded-full bg-[#E9EFEA] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#456451]">
          {props.published ? 'En ligne' : 'Brouillon'}
        </span>
      </div>
      <div className="mx-auto w-full max-w-[390px] rounded-[42px] border-[8px] border-[#1C2721] bg-[#1C2721] p-1 shadow-[0_35px_80px_rgba(28,39,33,.22)]">
        <div className="relative aspect-[9/17.4] overflow-hidden rounded-[31px] bg-[#2F3C34] text-white">
          <img
            src={props.coverURL}
            alt="Couverture de l’invitation"
            className={`absolute inset-0 h-full w-full object-cover ${props.animations ? 'preview-ken-burns' : ''}`}
          />
          {props.animations && (
            <>
              <div className="romantic-glow" aria-hidden="true" />
              <div className="romantic-petals" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
            </>
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${props.theme.overlay}`}
            style={{ opacity: props.overlay / 70 }}
          />
          <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />
          <div
            className={`absolute inset-0 flex flex-col ${position} ${alignment} p-7 ${props.fontPair === 'modern' ? 'font-sans' : ''} ${props.animations ? 'romantic-reveal' : ''}`}
          >
            <p
              className="mb-4 text-[10px] font-bold uppercase tracking-[.32em]"
              style={{ color: props.theme.accent }}
            >
              {props.form.title || 'Notre mariage'}
            </p>
            <h3
              className={`${props.fontPair === 'modern' ? 'font-sans font-light' : 'font-display'} text-[46px] leading-[.88] tracking-[-.04em]`}
            >
              {props.form.firstName || 'Ada'}{' '}
              <span
                className="block py-2 text-2xl font-normal italic"
                style={{ color: props.theme.accent }}
              >
                &
              </span>{' '}
              {props.form.secondName || 'Maty'}
            </h3>
            <div className="my-5 h-px w-14" style={{ backgroundColor: props.theme.accent }} />
            <p className="font-display text-[17px] capitalize">{props.dateLabel}</p>
            <p
              className={`mt-2 flex gap-1.5 text-[11px] text-white/75 ${props.heroLayout === 'editorial' ? 'justify-start' : 'justify-center'}`}
            >
              <Icon name="location" className="h-3.5 w-3.5" />{' '}
              {props.form.venue || 'Lieu à définir'}, Dakar
            </p>
            <div className="mt-5 grid w-full grid-cols-4 gap-2">
              {[
                [countdown.days, 'Jours'],
                [countdown.hours, 'Heures'],
                [countdown.minutes, 'Min'],
                [countdown.seconds, 'Sec'],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/20 bg-white/10 px-1 py-2 text-center backdrop-blur-md"
                >
                  <strong className="block font-display text-[17px] tabular-nums">{number}</strong>
                  <span className="text-[8px] uppercase tracking-wider text-white/65">{label}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-5 h-11 w-full rounded-full text-xs font-bold"
              style={{ backgroundColor: props.theme.button, color: props.theme.buttonText }}
            >
              Confirmer ma présence
            </button>
            <p className="mt-4 self-center text-[8px] uppercase tracking-[.18em] text-white/45">
              Créé avec Teranga Invit
            </p>
          </div>
        </div>
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-[#89928A]">
        <Icon name="check" className="h-4 w-4 text-[#6F927B]" /> L’aperçu se met à jour
        automatiquement
      </p>
    </aside>
  )
}

function useCountdown(date: string, startTime: string) {
  const [countdown, setCountdown] = useState({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  useEffect(() => {
    const updateCountdown = () => {
      if (!date) {
        setCountdown({ days: '000', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      // Dakar stays on UTC throughout the year.
      const target = new Date(`${date}T${startTime || '00:00'}:00+00:00`).getTime()
      const remaining = Math.max(0, target - Date.now())
      const totalSeconds = Math.floor(remaining / 1000)

      setCountdown({
        days: String(Math.floor(totalSeconds / 86_400)).padStart(3, '0'),
        hours: String(Math.floor((totalSeconds % 86_400) / 3_600)).padStart(2, '0'),
        minutes: String(Math.floor((totalSeconds % 3_600) / 60)).padStart(2, '0'),
        seconds: String(totalSeconds % 60).padStart(2, '0'),
      })
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [date, startTime])

  return countdown
}

function Card({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: Parameters<typeof Icon>[0]['name']
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[28px] border border-[#DDE2DB] bg-[#FCFCF9] p-5 shadow-[0_20px_55px_rgba(40,57,47,.06)] md:p-7">
      <div className="mb-6 flex items-center gap-4 border-b border-[#E3E6E0] pb-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8EFE9] text-[#315C45]">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold text-[#223A2D]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#879087]">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  required,
  hint,
  counter,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  counter?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-end justify-between gap-3 text-sm font-bold text-[#33463B]">
        <span>
          {label}
          {required && <span className="ml-1 text-[#A17145]">*</span>}
        </span>
        {counter && <span className="text-xs font-normal text-[#9A9F9B]">{counter}</span>}
      </span>
      {children}
      {hint && <span className="mt-2 block text-xs text-[#929994]">{hint}</span>}
    </label>
  )
}
