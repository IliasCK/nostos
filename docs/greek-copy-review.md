# Greek copy review

Every Greek string drafted by Claude Code, for Elias to review. Source of truth is `src/i18n/el.json`; this list tells you what's new or changed. Mark **OK** or write the corrected text.

**Tone:** informal singular (εσύ) throughout, as decided after M1.

| Key | Greek (draft) | English | Status |
|---|---|---|---|
| `meta.description` | Θα ήσουν οικονομικά καλύτερα αν μετακόμιζες στην Ελλάδα; Υπολογιστής και συγκρίσεις, σύντομα. | Would you be better or worse off financially if you moved to Greece? Calculator and comparisons, coming soon. | pending (M2: switched to εσύ) |
| `header.homeLabel` | Nostos, αρχική σελίδα | Nostos, home page | pending |
| `header.languageNav` | Επιλογή γλώσσας | Choose language | pending |
| `lang.el.name` | Ελληνικά | (same in both files) | pending |
| `home.title` | Nostos — έρχεται σύντομα | Nostos — coming soon | pending |
| `home.comingSoon` | Ένα εργαλείο που θα σε βοηθά να υπολογίσεις αν η επιστροφή στην Ελλάδα βγαίνει οικονομικά. Έρχεται σύντομα. | A tool to help you work out whether moving to Greece makes financial sense. Coming soon. | pending (M2: switched to εσύ) |
| `notFound.title` | Η σελίδα δεν βρέθηκε | Page not found | pending |
| `notFound.body` | Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί. | The page you're looking for doesn't exist or has moved. | pending (M2: switched to εσύ) |
| `notFound.backHome` | Επιστροφή στην αρχική | Back to the home page | pending |
| `banner.unverified.title` | ΜΗ ΕΠΑΛΗΘΕΥΜΕΝΕΣ ΦΟΡΟΛΟΓΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ | UNVERIFIED TAX PARAMETERS | pending (new in M2) |
| `banner.unverified.detail` | Δεν έχουν επαληθευτεί ακόμα {count} από τις {total} παραμέτρους. Οι αριθμοί δεν είναι τελικοί. | {count} of {total} parameters are not verified yet. Figures are not final. | pending (new in M2) |
| `calculatorPage.title` | Υπολογιστής μετακόμισης στην Ελλάδα | Move-to-Greece calculator | pending (new in M3) |
| `calculatorPage.intro` | Δες τι θα σου έμενε κάθε μήνα αν μετακόμιζες στην Ελλάδα: πρώτα αν πιθανότατα πληροίς τις προϋποθέσεις για την απαλλαγή του άρθρου 5Γ, μετά τον καθαρό σου μισθό, το ενοίκιο και τη σύγκριση με τη χώρα όπου ζεις. | See what you'd have left each month if you moved to Greece: first whether you're likely to qualify for the Article 5C break, then your net pay, rent and a comparison with the country you live in now. | pending (rewritten in M4) |
| `calculatorPage.noscript` | Το κουίζ χρειάζεται JavaScript για να λειτουργήσει. | The quiz needs JavaScript to work. | pending (new in M3) |
| `quiz.progress` | Ερώτηση {current} από {total} | Question {current} of {total} | pending (new in M3) |
| `quiz.back` | Πίσω | Back | pending (new in M3) |
| `quiz.restart` | Ξεκίνα από την αρχή | Start again | pending (new in M3) |
| `quiz.notSure` | Δεν ξέρω σίγουρα | Not sure | pending (new in M3) |
| `quiz.skippedNotice` | Κάποιες ερωτήσεις παραλείφθηκαν, γιατί οι κανόνες τους δεν έχουν επαληθευτεί ακόμα. | Some questions were skipped because their rules aren't verified yet. | pending (new in M3) |
| `quiz.q.priorResidence` | Σε πόσα από τα τελευταία {lookbackYears} χρόνια ήσουν φορολογικός κάτοικος Ελλάδας; | In how many of the last {lookbackYears} years were you a tax resident of Greece? | pending (new in M3) |
| `quiz.q.priorResidence.hint` | Μέτρα τα χρόνια πριν μεταφέρεις τη φορολογική σου κατοικία στην Ελλάδα. | Count the years before you move your tax residence to Greece. | pending (new in M3) |
| `quiz.q.origin` | Από ποια χώρα θα μεταφέρεις τη φορολογική σου κατοικία; | Which country would you move your tax residence from? | pending (new in M3) |
| `quiz.origin.DE` | Γερμανία | Germany | pending (new in M3) |
| `quiz.origin.GB` | Ηνωμένο Βασίλειο | United Kingdom | pending (new in M3) |
| `quiz.origin.NL` | Ολλανδία | Netherlands | pending (new in M3) |
| `quiz.origin.AU` | Αυστραλία | Australia | pending (new in M3) |
| `quiz.origin.US` | ΗΠΑ | United States | pending (new in M3) |
| `quiz.origin.BE` | Βέλγιο | Belgium | pending (new in M3) |
| `quiz.origin.SE` | Σουηδία | Sweden | pending (new in M3) |
| `quiz.origin.CY` | Κύπρος | Cyprus | pending (new in M3) |
| `quiz.origin.other_eu_eea` | Άλλη χώρα της ΕΕ ή του ΕΟΧ | Other EU/EEA country | pending (new in M3) |
| `quiz.origin.other` | Άλλη χώρα | Other country | pending (new in M3) |
| `quiz.q.work` | Πώς θα βγάζεις εισόδημα στην Ελλάδα; | How will you earn income in Greece? | pending (new in M3) |
| `quiz.work.greek_employer` | Υπάλληλος ελληνικής εταιρείας | Employee of a Greek company | pending (new in M3) |
| `quiz.work.greek_branch` | Υπάλληλος σε ελληνικό υποκατάστημα ή μόνιμη εγκατάσταση ξένης εταιρείας | Employee of a foreign company's Greek branch or permanent establishment | pending (new in M3) |
| `quiz.work.public_sector` | Υπάλληλος του ελληνικού Δημοσίου | Greek public sector employee | pending (new in M3) |
| `quiz.work.self_employed` | Ελεύθερος επαγγελματίας ή δική σου επιχείρηση στην Ελλάδα | Self-employed or own business in Greece | pending (new in M3) |
| `quiz.work.remote_foreign` | Τηλεργασία για ξένη εταιρεία χωρίς παρουσία στην Ελλάδα | Remote employee of a foreign company with no Greek presence | pending (new in M3) |
| `quiz.work.not_working` | Δεν θα εργάζομαι, είμαι συνταξιούχος ή κάτι άλλο | Not working, retired or other | pending (new in M3) |
| `quiz.q.stay` | Θα μείνεις στην Ελλάδα τουλάχιστον {minimumStayYears} χρόνια; | Will you stay in Greece for at least {minimumStayYears} years? | pending (new in M3) |
| `quiz.stay.yes` | Ναι | Yes | pending (new in M3) |
| `quiz.stay.no` | Όχι | No | pending (new in M3) |
| `quiz.results.title` | Το αποτέλεσμά σου | Your result | pending (new in M3) |
| `quiz.outcome.likely_eligible` | Πιθανότατα πληροίς τις προϋποθέσεις | Likely eligible | pending (new in M3) |
| `quiz.outcome.likely_eligible.body` | Με βάση τις απαντήσεις σου, πληροίς τις βασικές δημοσιευμένες προϋποθέσεις. Αυτό δεν είναι έγκριση. | Based on your answers, you meet the main published conditions. This is not an approval. | pending (new in M3) |
| `quiz.outcome.borderline` | Οριακή περίπτωση | Borderline | pending (new in M3) |
| `quiz.outcome.borderline.body` | Τουλάχιστον ένας κανόνας δεν μπορεί να κριθεί με σιγουριά. Δες παρακάτω ποιος και μίλησε με φοροτεχνικό. | At least one rule can't be judged with confidence. See which one below, and talk to a tax adviser. | pending (new in M3) |
| `quiz.outcome.likely_not_eligible` | Πιθανότατα δεν πληροίς τις προϋποθέσεις | Likely not eligible | pending (new in M3) |
| `quiz.outcome.likely_not_eligible.body` | Με βάση τις απαντήσεις σου, τουλάχιστον ένας κανόνας δεν πληρείται. | Based on your answers, at least one rule is not met. | pending (new in M3) |
| `quiz.ruleCards.title` | Κανόνας προς κανόνα | Rule by rule | pending (new in M3) |
| `quiz.card.priorResidence` | Προηγούμενη φορολογική κατοικία | Prior tax residence | pending (new in M3) |
| `quiz.card.origin` | Χώρα από την οποία έρχεσαι | Country you're moving from | pending (new in M3) |
| `quiz.card.work` | Εργασία στην Ελλάδα | Work in Greece | pending (new in M3) |
| `quiz.card.stay` | Διάρκεια παραμονής | Length of stay | pending (new in M3) |
| `quiz.verdict.pass` | Πληρείται | Met | pending (new in M3) |
| `quiz.verdict.borderline` | Αβέβαιο | Unclear | pending (new in M3) |
| `quiz.verdict.fail` | Δεν πληρείται | Not met | pending (new in M3) |
| `quiz.rule.label` | Κανόνας | Rule | pending (new in M3) |
| `quiz.answer.label` | Η απάντησή σου | Your answer | pending (new in M3) |
| `quiz.answer.notAsked` | Δεν ρωτήθηκε | Not asked | pending (new in M3) |
| `quiz.answer.years` | {years} χρόνια | {years} years | pending (new in M3) |
| `quiz.source.label` | Πηγή | Source | pending (new in M3) |
| `quiz.source.none` | Δεν έχει καταχωριστεί πηγή ακόμα. | No source recorded yet. | pending (new in M3) |
| `quiz.reason.rule_not_verified` | Ο κανόνας δεν έχει επαληθευτεί ακόμα. | Rule not yet verified. | pending (new in M3) |
| `quiz.reason.not_sure` | Απάντησες «δεν ξέρω σίγουρα». | You answered “not sure”. | pending (new in M3) |
| `quiz.reason.invalid_config` | Αυτός ο κανόνας δεν μπορεί να εφαρμοστεί αυτή τη στιγμή. | This rule can't be applied right now. | pending (new in M3) |
| `quiz.reason.not_answered` | Δεν απάντησες σε αυτή την ερώτηση. | You didn't answer this question. | pending (new in M3) |
| `quiz.rule.priorResidence` | Δεν πρέπει να ήσουν φορολογικός κάτοικος Ελλάδας για τουλάχιστον {requiredNonResidentYears} από τα {lookbackYears} χρόνια πριν από τη μετακόμιση. | You must not have been a Greek tax resident for at least {requiredNonResidentYears} of the {lookbackYears} years before the move. | pending (new in M3) |
| `quiz.rule.priorResidence.generic` | Δεν πρέπει να ήσουν φορολογικός κάτοικος Ελλάδας τα περισσότερα χρόνια πριν από τη μετακόμιση. Ο ακριβής αριθμός ετών δεν έχει επαληθευτεί ακόμα. | You must not have been a Greek tax resident for most of the years before the move. The exact number of years is not verified yet. | pending (new in M3) |
| `quiz.rule.origin` | Πρέπει να μεταφέρεις τη φορολογική σου κατοικία από χώρα της ΕΕ ή του ΕΟΧ, ή από χώρα που έχει σε ισχύ συμφωνία διοικητικής συνεργασίας σε φορολογικά θέματα με την Ελλάδα. | You must move your tax residence from an EU or EEA country, or from a country that has an administrative-cooperation agreement on tax matters in force with Greece. | pending (new in M3) |
| `quiz.rule.work` | Η απαλλαγή καλύπτει εισόδημα από εργασία στην Ελλάδα: μισθωτή εργασία σε ελληνικό εργοδότη ή σε ελληνική μόνιμη εγκατάσταση ξένης εταιρείας, ή επιχειρηματική δραστηριότητα στην Ελλάδα. | The break covers income from work in Greece: employment with a Greek employer or a Greek permanent establishment of a foreign company, or business activity in Greece. | pending (changed after M3: έκπτωση → απαλλαγή) |
| `quiz.rule.stay` | Πρέπει να δηλώσεις ότι θα μείνεις στην Ελλάδα τουλάχιστον {minimumStayYears} χρόνια. | You must declare that you'll stay in Greece for at least {minimumStayYears} years. | pending (new in M3) |
| `quiz.rule.stay.generic` | Πρέπει να δηλώσεις ότι θα μείνεις στην Ελλάδα για ένα ελάχιστο διάστημα. Η διάρκειά του δεν έχει επαληθευτεί ακόμα. | You must declare that you'll stay in Greece for a minimum period. Its length is not verified yet. | pending (new in M3) |
| `quiz.note.remote` | Αυτή είναι η πιο συνηθισμένη γκρίζα ζώνη. Ζήτα επιβεβαίωση από Έλληνα φοροτεχνικό πριν βασιστείς στην απαλλαγή 50%. | This is the most common grey area. Get confirmation from a Greek tax adviser before relying on the 50% break. | pending (changed after M3: έκπτωση → απαλλαγή) |
| `quiz.note.notWorking` | Το άρθρο 5Γ καλύπτει εισόδημα από εργασία. Υπάρχουν άλλα καθεστώτα για συνταξιούχους και επενδυτές, που δεν καλύπτονται από αυτό το εργαλείο. | Article 5C covers income from work. Other regimes exist for pensioners and investors; they're not covered by this tool. | pending (new in M3) |
| `quiz.note.otherCountry` | Έλεγξε αν η Ελλάδα έχει σε ισχύ συμφωνία διοικητικής συνεργασίας σε φορολογικά θέματα με αυτή τη χώρα. | Check whether Greece has an administrative-cooperation agreement on tax matters in force with this country. | pending (new in M3) |
| `quiz.note.cooperationUnconfirmed` | Δεν έχουμε επιβεβαιώσει ακόμα ότι αυτή η χώρα πληροί την προϋπόθεση της συνεργασίας. | We haven't yet confirmed that this country meets the cooperation condition. | pending (new in M3) |
| `quiz.disclaimer` | Αυτός ο έλεγχος καλύπτει τις βασικές δημοσιευμένες προϋποθέσεις. Δεν είναι απόφαση. Μόνο η ΑΑΔΕ αποφασίζει αν πληροίς τις προϋποθέσεις. | This checks the main published conditions. It is not a ruling. Only AADE decides eligibility. | pending (new in M3) |
| `footer.disclaimer` | Μόνο εκτιμήσεις. Δεν αποτελούν φορολογική ή χρηματοοικονομική συμβουλή. | Estimates only, not tax or financial advice. | pending (new in M4) |
| `footer.methodology` | Πώς υπολογίζουμε | Methodology | pending (new in M4) |
| `calc.step.quiz` | Βήμα 1 · Άρθρο 5Γ | Step 1 · Article 5C | pending (new in M4) |
| `calc.step.form` | Βήμα 2 · Τα στοιχεία σου | Step 2 · Your details | pending (new in M4) |
| `calc.step.results` | Βήμα 3 · Αποτελέσματα | Step 3 · Results | pending (new in M4) |
| `calc.form.intro` | Συμπλήρωσε τα παρακάτω για να δεις τι θα σου έμενε κάθε μήνα στην Ελλάδα. Τίποτα από όσα γράφεις δεν φεύγει από τη συσκευή σου. | Fill in the details below to see what you'd have left each month in Greece. Nothing you enter leaves your device. | pending (new in M4) |
| `calc.section.now` | Πού είσαι τώρα | Where you are now | pending (new in M4) |
| `calc.section.greece` | Στην Ελλάδα | In Greece | pending (new in M4) |
| `calc.section.you` | Για σένα | About you | pending (new in M4) |
| `calc.field.origin` | Χώρα όπου ζεις τώρα | Country you live in now | pending (new in M4) |
| `calc.field.choose` | Διάλεξε… | Choose… | pending (new in M4) |
| `calc.field.netMonthly` | Καθαρές μηνιαίες αποδοχές σου τώρα | Your current net monthly pay | pending (new in M4) |
| `calc.field.netMonthly.hint` | Ό,τι μπαίνει στον λογαριασμό σου κάθε μήνα, σε {currency}. | What reaches your bank account each month, in {currency}. | pending (new in M4) |
| `calc.field.rentMonthly` | Μηνιαίο ενοίκιο τώρα | Your current monthly rent | pending (new in M4) |
| `calc.field.rentMonthly.hint` | Σε {currency}. | In {currency}. | pending (new in M4) |
| `calc.field.noRent` | Μένω σε δικό μου σπίτι ή δεν πληρώνω ενοίκιο | I own my home or pay no rent | pending (new in M4) |
| `calc.field.children` | Εξαρτώμενα παιδιά | Dependent children | pending (new in M4) |
| `calc.field.birthYear` | Έτος γέννησης | Year of birth | pending (new in M4) |
| `calc.field.birthYear.hint` | Από το 2026 οι φορολογικοί συντελεστές στην Ελλάδα εξαρτώνται και από την ηλικία. | From 2026, Greek tax rates also depend on age. | pending (new in M4) |
| `calc.field.city` | Πόλη στην Ελλάδα | City in Greece | pending (new in M4) |
| `calc.field.grossAnnual` | Αναμενόμενος μικτός ετήσιος μισθός στην Ελλάδα (€) | Expected gross annual salary in Greece (€) | pending (new in M4) |
| `calc.field.grossAnnual.hint` | Στην Ελλάδα οι μισθοί συνήθως αναφέρονται ανά μήνα και πληρώνονται σε {payments} δόσεις τον χρόνο, μαζί με τα δώρα και το επίδομα αδείας. Αν σου προσφέρουν {example} μικτά τον μήνα, ο ετήσιος μικτός είναι {example} × {payments} = {annual}. | Greek salaries are usually quoted per month and paid in {payments} instalments a year, including bonuses and holiday pay. If you're offered {example} gross a month, the annual gross is {example} × {payments} = {annual}. | pending (new in M4) |
| `calc.field.grossAnnual.hint.generic` | Στην Ελλάδα οι μισθοί συνήθως αναφέρονται ανά μήνα και πληρώνονται περισσότερες από 12 φορές τον χρόνο, λόγω των δώρων και του επιδόματος αδείας. Γράψε το ετήσιο σύνολο. | Greek salaries are usually quoted per month and paid more than 12 times a year, because of bonuses and holiday pay. Enter the yearly total. | pending (new in M4) |
| `calc.field.size` | Μέγεθος σπιτιού | Apartment size | pending (new in M4) |
| `calc.size.studio` | Γκαρσονιέρα | Studio | pending (new in M4) |
| `calc.size.one_bed` | 1 υπνοδωμάτιο | 1 bedroom | pending (new in M4) |
| `calc.size.two_bed` | 2 υπνοδωμάτια | 2 bedrooms | pending (new in M4) |
| `calc.size.three_bed` | 3 υπνοδωμάτια | 3 bedrooms | pending (new in M4) |
| `calc.city.athens` | Αθήνα | Athens | pending (new in M4) |
| `calc.city.thessaloniki` | Θεσσαλονίκη | Thessaloniki | pending (new in M4) |
| `calc.city.heraklion` | Ηράκλειο | Heraklion | pending (new in M4) |
| `calc.city.patras` | Πάτρα | Patras | pending (new in M4) |
| `calc.city.athens.in` | Στην Αθήνα | In Athens | pending (new in M4) |
| `calc.city.thessaloniki.in` | Στη Θεσσαλονίκη | In Thessaloniki | pending (new in M4) |
| `calc.city.heraklion.in` | Στο Ηράκλειο | In Heraklion | pending (new in M4) |
| `calc.city.patras.in` | Στην Πάτρα | In Patras | pending (new in M4) |
| `calc.submit` | Υπολόγισε | Calculate | pending (new in M4) |
| `calc.errors.summary` | Διόρθωσε τα πεδία που σημειώνονται. | Please fix the fields marked below. | pending (new in M4) |
| `calc.error.required` | Συμπλήρωσε αυτό το πεδίο. | Please fill this in. | pending (new in M4) |
| `calc.error.notANumber` | Γράψε έναν αριθμό. | Enter a number. | pending (new in M4) |
| `calc.error.tooSmall` | Ο αριθμός είναι πολύ μικρός. | That number is too small. | pending (new in M4) |
| `calc.error.tooLarge` | Ο αριθμός είναι πολύ μεγάλος. | That number is too large. | pending (new in M4) |
| `calc.error.invalidChoice` | Διάλεξε μία από τις επιλογές. | Choose one of the options. | pending (new in M4) |
| `calc.error.birthYear.tooSmall` | Το έτος γέννησης φαίνεται πολύ παλιό. | That year of birth looks too early. | pending (new in M4) |
| `calc.error.birthYear.tooLarge` | Ο υπολογιστής είναι για άτομα 16 ετών και άνω. | The calculator is for people aged 16 or over. | pending (new in M4) |
| `calc.results.title` | Τι θα σου έμενε | What you'd have left | pending (new in M4) |
| `calc.results.edit` | Άλλαξε τα στοιχεία σου | Change your details | pending (new in M4) |
| `calc.headline.with5c` | {cityIn} θα σου έμεναν {change} χρήματα μετά το ενοίκιο, σε όρους αγοραστικής δύναμης, τα χρόνια 1–{duration}. | {cityIn} you'd have {change} left after rent, in purchasing-power terms, during years 1–{duration}. | pending (new in M4) |
| `calc.headline.with5c.averaged` | {cityIn} θα σου έμεναν κατά μέσο όρο {change} χρήματα μετά το ενοίκιο, σε όρους αγοραστικής δύναμης, τα χρόνια 1–{duration}. | {cityIn} you'd have, on average, {change} left after rent, in purchasing-power terms, during years 1–{duration}. | pending (new in M4) |
| `calc.headline.cliff` | Από τον {cliffYear}ο χρόνο: {change}. | From year {cliffYear}: {change}. | pending (new in M4) |
| `calc.headline.without5c` | {cityIn} θα σου έμεναν {change} χρήματα μετά το ενοίκιο, σε όρους αγοραστικής δύναμης. | {cityIn} you'd have {change} left after rent, in purchasing-power terms. | pending (new in M4) |
| `calc.change.more` | περίπου {pct}% περισσότερα | about {pct}% more | pending (new in M4) |
| `calc.change.less` | περίπου {pct}% λιγότερα | about {pct}% less | pending (new in M4) |
| `calc.change.same` | περίπου τα ίδια | about the same | pending (new in M4) |
| `calc.borderlineNote` | Η επιλεξιμότητά σου για το 5Γ είναι οριακή, γι' αυτό δείχνουμε και τα δύο σενάρια. Επιβεβαίωσε με φοροτεχνικό πριν βασιστείς στην απαλλαγή. | Your 5C eligibility is borderline, so both scenarios are shown. Check with a tax adviser before relying on the break. | pending (new in M4) |
| `calc.net.title` | Καθαρός μισθός στην Ελλάδα | Net pay in Greece | pending (new in M4) |
| `calc.net.with5c` | Με την απαλλαγή 5Γ | With the 5C break | pending (new in M4) |
| `calc.net.without5c` | Χωρίς την απαλλαγή 5Γ | Without the 5C break | pending (new in M4) |
| `calc.net.perMonth` | τον μήνα | a month | pending (new in M4) |
| `calc.net.year1` | Πρώτος χρόνος ({taxYear}) | Year 1 ({taxYear}) | pending (new in M4) |
| `calc.net.basisNote` | Ετήσιος καθαρός ÷ 12. Στην πράξη πληρώνεσαι σε {payments} δόσεις των {perPayment} περίπου. | Annual net ÷ 12. In practice you're paid in {payments} instalments of about {perPayment}. | pending (new in M4) |
| `calc.net.annual` | Ετήσιος καθαρός: {amount} | Annual net: {amount} | pending (new in M4) |
| `calc.net.whatIf` | Κι αν πληρούσες τις προϋποθέσεις του 5Γ; | What if you did qualify for 5C? | pending (new in M4) |
| `calc.breakdown.title` | Ανάλυση πρώτου χρόνου | Year-1 breakdown | pending (new in M4) |
| `calc.breakdown.gross` | Μικτός ετήσιος | Gross annual | pending (new in M4) |
| `calc.breakdown.contributions` | Εισφορές ΕΦΚΑ εργαζομένου | Employee EFKA contributions | pending (new in M4) |
| `calc.breakdown.taxable` | Φορολογητέο εισόδημα | Taxable income | pending (new in M4) |
| `calc.breakdown.exempt` | Εισόδημα που απαλλάσσεται (5Γ) | Income exempt under 5C | pending (new in M4) |
| `calc.breakdown.taxBefore` | Φόρος πριν τη μείωση | Tax before reduction | pending (new in M4) |
| `calc.breakdown.reduction` | Μείωση φόρου | Tax reduction | pending (new in M4) |
| `calc.breakdown.relief` | Φόρος που απαλλάσσεται (5Γ) | Tax relieved under 5C | pending (new in M4) |
| `calc.breakdown.finalTax` | Φόρος εισοδήματος | Income tax | pending (new in M4) |
| `calc.breakdown.solidarity` | Εισφορά αλληλεγγύης | Solidarity contribution | pending (new in M4) |
| `calc.breakdown.net` | Καθαρός ετήσιος | Net annual | pending (new in M4) |
| `calc.5cUnavailable` | Τα ποσά με την απαλλαγή 5Γ δεν είναι ακόμα διαθέσιμα. | Figures with the 5C break aren't available yet. | pending (new in M4) |
| `calc.rent.title` | Ενοίκιο στην Ελλάδα | Rent in Greece | pending (new in M4) |
| `calc.rent.label` | με βάση τα μέσα ζητούμενα ενοίκια (Spitogatos, {quarter}) | based on average asking rents (Spitogatos, {quarter}) | pending (new in M4) |
| `calc.rent.disclaimer` | Μέσα ζητούμενα ενοίκια. Τα ενοίκια που τελικά συμφωνούνται είναι συχνά χαμηλότερα. | Average asking rents. Actual signed rents are often lower. | pending (new in M4) |
| `calc.compare.title` | Ελλάδα και {country} | Greece vs {country} | pending (new in M4) |
| `calc.compare.greece` | Ελλάδα | Greece | pending (new in M4) |
| `calc.compare.row.net` | Καθαρές αποδοχές τον μήνα | Net pay a month | pending (new in M4) |
| `calc.compare.row.rent` | Ενοίκιο | Rent | pending (new in M4) |
| `calc.compare.row.leftLocal` | Μένουν μετά το ενοίκιο | Left after rent | pending (new in M4) |
| `calc.compare.row.leftEur` | Σε ευρώ, με τη σημερινή ισοτιμία | In euros, at today's rate | pending (new in M4) |
| `calc.compare.row.ppp` | Σε ελληνικές τιμές (αγοραστική δύναμη) | In Greek prices (purchasing power) | pending (new in M4) |
| `calc.compare.scenario.with5c` | Τα χρόνια 1–{duration}, με την απαλλαγή 5Γ | Years 1–{duration}, with the 5C break | pending (new in M4) |
| `calc.compare.scenario.with5c.averaged` | Τα χρόνια 1–{duration}, με την απαλλαγή 5Γ (μέσος όρος) | Years 1–{duration}, with the 5C break (average) | pending (new in M4) |
| `calc.compare.scenario.cliff` | Από τον {cliffYear}ο χρόνο | From year {cliffYear} | pending (new in M4) |
| `calc.compare.scenario.without5c` | Χωρίς την απαλλαγή 5Γ | Without the 5C break | pending (new in M4) |
| `calc.compare.pppNote` | Το «σε ελληνικές τιμές» δείχνει τι θα αγόραζαν στην Ελλάδα τα χρήματα που σου μένουν τώρα, με βάση τους δείκτες επιπέδου τιμών. | “In Greek prices” shows what the money you have left now would buy in Greece, using price level indices. | pending (new in M4) |
| `calc.compare.noPct` | Τώρα δεν σου μένουν χρήματα μετά το ενοίκιο, οπότε δεν δείχνουμε ποσοστό. | You currently have nothing left after rent, so no percentage is shown. | pending (new in M4) |
| `calc.chart.title` | Καθαρός μισθός ανά χρόνο | Net pay year by year | pending (new in M4) |
| `calc.chart.desc` | Μηνιαίος καθαρός (ετήσιος ÷ 12). Η απαλλαγή 5Γ ισχύει τα χρόνια 1–{duration} και σταματά από τον {cliffYear}ο χρόνο. | Monthly net (annual ÷ 12). The 5C break applies in years 1–{duration} and stops from year {cliffYear}. | pending (new in M4) |
| `calc.chart.with5c` | Με 5Γ | With 5C | pending (new in M4) |
| `calc.chart.without5c` | Χωρίς 5Γ | Without 5C | pending (new in M4) |
| `calc.chart.cliff` | Τέλος 5Γ | 5C ends | pending (new in M4) |
| `calc.chart.year` | Χρ. {year} | Yr {year} | pending (new in M4) |
| `calc.chart.drop` | Αλλαγή από τον {cliffYear}ο χρόνο: {amount} τον μήνα | Change from year {cliffYear}: {amount} a month | pending (new in M4) |
| `calc.chart.table` | Δες τους αριθμούς σε πίνακα | Show the numbers as a table | pending (new in M4) |
| `calc.chart.col.year` | Χρόνος | Year | pending (new in M4) |
| `calc.chart.col.taxYear` | Φορολογικό έτος | Tax year | pending (new in M4) |
| `calc.chart.col.ageBand` | Ηλικιακή ομάδα | Age band | pending (new in M4) |
| `calc.chart.onwards` | {year} και μετά | {year} onwards | pending (new in M4) |
| `calc.ageBand.upTo25` | έως 25 | up to 25 | pending (new in M4) |
| `calc.unverified.title` | Δεν μπορούμε να το υπολογίσουμε ακόμα | We can't calculate this yet | pending (new in M4) |
| `calc.unverified.body` | Κάποιοι φορολογικοί κανόνες του 2026 που χρειάζεται ο υπολογισμός δεν έχουν επαληθευτεί ακόμα. Προτιμάμε να μη δείξουμε αριθμό παρά να δείξουμε λάθος. | Some of the 2026 tax rules this calculation needs haven't been verified yet. We'd rather show nothing than a wrong number. | pending (new in M4) |
| `calc.unverified.listTitle` | Μένει να επαληθευτούν: | Still to be verified: | pending (new in M4) |
| `calc.unavailable.title` | Τα δεδομένα δεν είναι ακόμα διαθέσιμα | Data not yet available | pending (new in M4) |
| `calc.unavailable.body` | Αυτό το κομμάτι θα εμφανιστεί μόλις προστεθούν: | This part will appear once the following is added: | pending (new in M4) |
| `calc.param.incomeTax.brackets` | Φορολογικοί συντελεστές μισθωτών 2026 | 2026 income tax rates for employees | pending (new in M4) |
| `calc.param.incomeTax.youthRelief.upTo25` | Μειωμένοι συντελεστές για νέους έως 25 | Reduced rates for people up to 25 | pending (new in M4) |
| `calc.param.incomeTax.youthRelief.26to30` | Μειωμένοι συντελεστές για νέους 26–30 | Reduced rates for people aged 26–30 | pending (new in M4) |
| `calc.param.incomeTax.youthChildrenInteraction` | Πώς συνδυάζονται οι ελαφρύνσεις για νέους και για παιδιά | How the youth and children reliefs combine | pending (new in M4) |
| `calc.param.incomeTax.youthAgeRule` | Πώς μετράται η ηλικία για τους συντελεστές νέων | How age is counted for the youth rates | pending (new in M4) |
| `calc.param.taxReduction.baseAmountByChildren` | Μείωση φόρου ανά αριθμό παιδιών | Tax reduction by number of children | pending (new in M4) |
| `calc.param.taxReduction.phaseOutThreshold` | Όριο εισοδήματος για τη σταδιακή κατάργηση της μείωσης φόρου | Income threshold for phasing out the tax reduction | pending (new in M4) |
| `calc.param.taxReduction.phaseOutRate` | Ρυθμός σταδιακής κατάργησης της μείωσης φόρου | Rate at which the tax reduction phases out | pending (new in M4) |
| `calc.param.taxReduction.phaseOutMethod` | Τρόπος σταδιακής κατάργησης της μείωσης φόρου | How the tax reduction phases out | pending (new in M4) |
| `calc.param.efka.employeeRate` | Ποσοστό εισφορών ΕΦΚΑ εργαζομένου | Employee EFKA contribution rate | pending (new in M4) |
| `calc.param.efka.monthlyInsurableCeiling` | Ανώτατο όριο ασφαλιστέων αποδοχών ΕΦΚΑ | EFKA monthly earnings ceiling | pending (new in M4) |
| `calc.param.solidarityContribution.appliesToEmploymentIncome` | Αν ισχύει η εισφορά αλληλεγγύης | Whether the solidarity contribution applies | pending (new in M4) |
| `calc.param.solidarityContribution.brackets` | Κλίμακα εισφοράς αλληλεγγύης | Solidarity contribution rates | pending (new in M4) |
| `calc.param.salaryPaymentsPerYear` | Αριθμός μισθών τον χρόνο | Number of salary payments a year | pending (new in M4) |
| `calc.param.art5c.exemptionRate` | Ποσοστό απαλλαγής 5Γ | Share exempt under 5C | pending (new in M4) |
| `calc.param.art5c.exemptionAppliesTo` | Τι καλύπτει η απαλλαγή 5Γ | What the 5C break covers | pending (new in M4) |
| `calc.param.art5c.exemptionMethod` | Πώς υπολογίζεται η απαλλαγή 5Γ | How the 5C break is calculated | pending (new in M4) |
| `calc.param.art5c.exemptionBase` | Σε ποιο ποσό εφαρμόζεται η απαλλαγή 5Γ | Which amount the 5C break applies to | pending (new in M4) |
| `calc.param.art5c.reductionPhaseOutIncome` | Πώς συνδυάζεται το 5Γ με τη μείωση φόρου | How 5C interacts with the tax reduction | pending (new in M4) |
| `calc.param.art5c.reductionOrder` | Σειρά εφαρμογής του 5Γ και της μείωσης φόρου | Order of 5C and the tax reduction | pending (new in M4) |
| `calc.param.art5c.youthReliefInteraction` | Αν το 5Γ συνδυάζεται με τους συντελεστές νέων | Whether 5C combines with the youth rates | pending (new in M4) |
| `calc.param.art5c.durationYears` | Διάρκεια της απαλλαγής 5Γ | How long the 5C break lasts | pending (new in M4) |
| `calc.data.fx` | Συναλλαγματικές ισοτιμίες (ΕΚΤ) | Exchange rates (ECB) | pending (new in M4) |
| `calc.data.fxCurrency` | Ισοτιμία ευρώ–{currency} (ΕΚΤ) | EUR–{currency} exchange rate (ECB) | pending (new in M4) |
| `calc.data.priceLevels` | Δείκτες επιπέδου τιμών (ΟΟΣΑ) | Price level indices (OECD) | pending (new in M4) |
| `calc.data.priceLevelCountry` | Επίπεδο τιμών: {country} | Price level: {country} | pending (new in M4) |
| `calc.data.rent` | Στοιχεία ενοικίων Spitogatos | Spitogatos rent figures | pending (new in M4) |
| `calc.data.rentCity` | Ενοίκιο ανά m²: {city} | Rent per m²: {city} | pending (new in M4) |
| `calc.data.rentSize` | Εμβαδόν για: {size} | Floor area for: {size} | pending (new in M4) |
| `calc.assume.title` | Παραδοχές | Assumptions | pending (new in M4) |
| `calc.assume.oneEarner` | Ο υπολογισμός αφορά έναν εργαζόμενο. Θεωρούμε ότι το ενοίκιο το πληρώνεις ολόκληρο εσύ. | Calculated for one earner. Rent is assumed to be paid in full by you. | pending (new in M4) |
| `calc.assume.rules` | Οι φορολογικοί κανόνες του {taxYear} εφαρμόζονται σε όλα τα χρόνια. | The {taxYear} Greek tax rules are applied to every year shown. | pending (new in M4) |
| `calc.assume.age` | Η ηλικιακή σου ομάδα κάθε χρόνο υπολογίζεται από το έτος γέννησής σου ({birthYear}). | Your age band each year is worked out from your year of birth ({birthYear}). | pending (new in M4) |
| `calc.assume.payments` | Ο μικτός μισθός πληρώνεται σε {payments} ίσες δόσεις τον χρόνο. | Gross salary is paid in {payments} equal instalments a year. | pending (new in M4) |
| `calc.assume.efka` | Εισφορές ΕΦΚΑ εργαζομένου: {rate} του μικτού, για αποδοχές έως {ceiling} τον μήνα. | Employee EFKA contributions: {rate} of gross pay, on earnings up to {ceiling} a month. | pending (new in M4) |
| `calc.assume.fiveC` | Άρθρο 5Γ: απαλλαγή {rate} για {years} χρόνια. | Article 5C: {rate} exempt for {years} years. | pending (new in M4) |
| `calc.assume.rent` | Ενοίκιο: {eurPerM2}/m² × {m2} m², μέσο ζητούμενο ενοίκιο ({city}, Spitogatos, {quarter}). | Rent: {eurPerM2}/m² × {m2} m², average asking rent ({city}, Spitogatos, {quarter}). | pending (new in M4) |
| `calc.assume.fx` | Ισοτιμία: 1 € = {rate} {currency} (ΕΚΤ, {date}). | Exchange rate: €1 = {rate} {currency} (ECB, {date}). | pending (new in M4) |
| `calc.assume.priceLevels` | Επίπεδα τιμών: {basis}, {year}. | Price levels: {basis}, {year}. | pending (new in M4) |
| `calc.assume.constant` | Ο σημερινός σου μισθός, το σημερινό σου ενοίκιο και τα ελληνικά ενοίκια μένουν σταθερά. Δεν υπολογίζουμε πληθωρισμό ή αυξήσεις. | Your current pay and rent, and Greek rents, are kept at today's level. No inflation or pay rises. | pending (new in M4) |
| `calc.assume.more` | Όλοι οι τύποι και οι πηγές | All formulas and sources | pending (new in M4) |
| `calc.disclaimer` | Αυτή είναι μια εκτίμηση με βάση δημοσιευμένα στοιχεία και τους κανόνες όπως τους καταλαβαίνουμε. Οι φορολογικοί κανόνες αλλάζουν και κάθε περίπτωση είναι διαφορετική. Επιβεβαίωσε με Έλληνα φοροτεχνικό πριν πάρεις αποφάσεις. | This is an estimate based on published figures and the rules as we understand them. Tax rules change, and individual circumstances differ. Confirm with a Greek tax adviser before making decisions. | pending (new in M4) |
| `calc.email.title` | Μάθε όταν αλλάζουν οι κανόνες | Hear when the rules change | pending (new in M4) |
| `calc.email.body` | Θα σου στέλνουμε ειδοποιήσεις όταν αλλάζουν οι κανόνες και νέα του site. Τίποτε άλλο. | We'll email you rule-change alerts and site updates. Nothing else. | pending (new in M4) |
| `calc.email.consent` | Συμφωνώ να λαμβάνω ειδοποιήσεις για αλλαγές κανόνων και νέα του site. Μπορώ να διαγραφώ όποτε θέλω. | I agree to receive rule-change alerts and site updates. I can unsubscribe at any time. | pending (new in M4) |
| `calc.email.submit` | Εγγραφή | Sign up | pending (new in M4) |
| `calc.email.comingSoon` | Έρχεται σύντομα | Coming soon | pending (new in M4) |

Not listed (not Greek text, or identical in both languages): `site.name`, `lang.el.short`, `lang.en.short`, `lang.en.name`, `calc.ageBand.26to30`, `calc.ageBand.31plus`, `calc.email.label`.

Notes for review:
- `banner.unverified.*` is a temporary banner that only appears before launch (it can never appear on the production build), but it is visible on the public workers.dev preview.
- `banner.unverified.detail`: `{count}` and `{total}` are filled in automatically (e.g. "29 από τις 29"). The sentence is worded so the number is the subject.
- `home.comingSoon` speaks of "returning to Greece" (επιστροφή), which fits Greeks abroad better than foreigners. OK for the Greek version?
- **Quiz (M3):**
  - **Placeholders:** `{lookbackYears}`, `{requiredNonResidentYears}`, `{minimumStayYears}`, `{years}`, `{current}` and `{total}` are filled in from config or progress.
  - **Gender:** "φορολογικός κάτοικος" and "Ελεύθερος επαγγελματίας" use the generic masculine. "Δεν ξέρω σίγουρα" was chosen for "not sure" because it is gender-neutral (unlike "Δεν είμαι σίγουρος/η").
  - **SPEC-mandated texts:** `quiz.note.remote`, `quiz.note.notWorking` and `quiz.disclaimer` are translations of exact SPEC wording (§5.2, §11).
  - **Decided (after M3):** 5C is always "απαλλαγή", never "έκπτωση". "Not sure" stays "Δεν ξέρω σίγουρα".
- **Calculator (M4):**
  - **Placeholders:** `{cityIn}` is filled with the `calc.city.*.in` phrase ("Στην Αθήνα", "Στη Θεσσαλονίκη", "Στο Ηράκλειο", "Στην Πάτρα") and `{change}` with a `calc.change.*` phrase. The headline therefore reads e.g. «Στην Αθήνα θα σου έμεναν περίπου 18% περισσότερα χρήματα μετά το ενοίκιο, σε όρους αγοραστικής δύναμης, τα χρόνια 1–7.» Please check that these combinations read naturally.
  - **Ordinals:** "{cliffYear}ο χρόνο" yields "8ο χρόνο".
  - **"ελαφρύνσεις":** used for the youth and children reliefs (never "έκπτωση").
  - **SPEC-mandated texts:** `calc.disclaimer` and `calc.rent.disclaimer` translate SPEC §11. `calc.assume.oneEarner` is the sentence you specified.
  - **Not for review:** the demo-mode labels in `src/demo/bundle.ts` ("ΔΟΚΙΜΗ — ΨΕΥΤΙΚΟΙ ΑΡΙΘΜΟΙ" etc.). They exist only in `npm run dev` and can never ship.
