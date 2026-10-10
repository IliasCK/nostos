# Greek copy review

Every Greek string drafted by Claude Code, for Elias to review. Source of truth is `src/i18n/el.json`; this list tells you what's new or changed. Mark **OK** or write the corrected text.

**Tone:** informal singular (εσύ) throughout, as decided after M1.

| Key | Greek (draft) | English | Status |
|---|---|---|---|
| `meta.description` | Θα ήσουν οικονομικά καλύτερα ή χειρότερα αν μετακόμιζες στην Ελλάδα; Υπολόγισε τι θα σου έμενε μετά το ενοίκιο, σε πραγματική αγοραστική δύναμη. | Would you be better or worse off financially if you moved to Greece? Work out what you'd have left after rent, in real purchasing power. | pending (rewritten in M7) |
| `header.homeLabel` | Nostos, αρχική σελίδα | Nostos, home page | pending |
| `header.languageNav` | Επιλογή γλώσσας | Choose language | pending |
| `lang.el.name` | Ελληνικά | (same in both files) | pending |
| `home.title` | Θα σε συνέφερε η μετακόμιση στην Ελλάδα; | Would moving to Greece pay off? | pending (rewritten in M7) |
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
| `peers.title` | Η Ελλάδα σε σύγκριση | Greece compared | pending (new in M6) |
| `peers.intro` | Έξι δείκτες που συγκρίνουν την Ελλάδα με τη Βουλγαρία, τη Ρουμανία, την Πορτογαλία, την Ισπανία, την Ιταλία και τον μέσο όρο της ΕΕ-27. Όλα τα στοιχεία είναι της Eurostat. | Six indicators comparing Greece with Bulgaria, Romania, Portugal, Spain, Italy and the EU-27 average. All figures are from Eurostat. | pending (new in M6) |
| `peers.pps` | ΜΑΔ (Μονάδες Αγοραστικής Δύναμης): ένα τεχνητό νόμισμα που εξαλείφει τις διαφορές στα επίπεδα τιμών ανάμεσα στις χώρες, ώστε τα ποσά να συγκρίνονται άμεσα. | PPS (purchasing power standard): an artificial currency that removes price-level differences between countries, so amounts can be compared directly. | pending (new in M6) |
| `peers.updated` | Τελευταία ενημέρωση στοιχείων: {date}. | Data last updated: {date}. | pending (new in M6) |
| `peers.legend.greece` | Ελλάδα | Greece | pending (new in M6) |
| `peers.legend.eu` | Μέσος όρος ΕΕ-27: {value} | EU-27 average: {value} | pending (new in M6) |
| `peers.greeceMarker` | Ελλάδα | Greece | pending (new in M6) |
| `peers.year` | Στοιχεία: {year} | Data for {year} | pending (new in M6) |
| `peers.source` | Πηγή: Eurostat, {dataset} | Source: Eurostat, {dataset} | pending (new in M6) |
| `peers.table` | Δες τους αριθμούς σε πίνακα | Show the numbers as a table | pending (new in M6) |
| `peers.table.country` | Χώρα | Country | pending (new in M6) |
| `peers.table.value` | Τιμή | Value | pending (new in M6) |
| `peers.country.GR` | Ελλάδα | Greece | pending (new in M6) |
| `peers.country.BG` | Βουλγαρία | Bulgaria | pending (new in M6) |
| `peers.country.RO` | Ρουμανία | Romania | pending (new in M6) |
| `peers.country.PT` | Πορτογαλία | Portugal | pending (new in M6) |
| `peers.country.ES` | Ισπανία | Spain | pending (new in M6) |
| `peers.country.IT` | Ιταλία | Italy | pending (new in M6) |
| `peers.country.EU27` | ΕΕ-27 | EU-27 | pending (new in M6) |
| `peers.gap.relative.below` | {amount}% κάτω από τον | {amount}% below | pending (new in M6) |
| `peers.gap.relative.above` | {amount}% πάνω από τον | {amount}% above | pending (new in M6) |
| `peers.gap.points.below` | {amount} ποσοστιαίες μονάδες κάτω από τον | {amount} percentage points below | pending (new in M6) |
| `peers.gap.points.above` | {amount} ποσοστιαίες μονάδες πάνω από τον | {amount} percentage points above | pending (new in M6) |
| `peers.gap.same` | περίπου στο ίδιο επίπεδο με τον | about the same as | pending (new in M6) |
| `peers.rank.top.1` | την υψηλότερη | the highest | pending (new in M6) |
| `peers.rank.top.2` | τη δεύτερη υψηλότερη | the second-highest | pending (new in M6) |
| `peers.rank.top.3` | την τρίτη υψηλότερη | the third-highest | pending (new in M6) |
| `peers.rank.bottom.1` | τη χαμηλότερη | the lowest | pending (new in M6) |
| `peers.rank.bottom.2` | τη δεύτερη χαμηλότερη | the second-lowest | pending (new in M6) |
| `peers.rank.bottom.3` | την τρίτη χαμηλότερη | the third-lowest | pending (new in M6) |
| `peers.half.1` | α΄ εξάμηνο {year} | first half of {year} | pending (new in M6) |
| `peers.half.2` | β΄ εξάμηνο {year} | second half of {year} | pending (new in M6) |
| `peers.rankClause` | η Ελλάδα έχει {rank} τιμή ανάμεσα στις {n} χώρες | Greece has {rank} value of the {n} countries shown | pending (new in M6) |
| `peers.gdpPerCapitaPps.title` | ΑΕΠ ανά κάτοικο | GDP per person | pending (new in M6) |
| `peers.gdpPerCapitaPps.unit` | ΜΑΔ ανά κάτοικο, τρέχουσες τιμές | PPS per person, current prices | pending (new in M6) |
| `peers.gdpPerCapitaPps.takeaway` | Το ΑΕΠ ανά κάτοικο στην Ελλάδα βρίσκεται {gap} μέσο όρο της ΕΕ-27· {rankClause}. | GDP per person in Greece is {gap} the EU-27 average; {rankClause}. | pending (new in M6) |
| `peers.aicPerCapitaPps.title` | Πραγματική ατομική κατανάλωση ανά κάτοικο | Actual individual consumption per person | pending (new in M6) |
| `peers.aicPerCapitaPps.unit` | ΜΑΔ ανά κάτοικο | PPS per person | pending (new in M6) |
| `peers.aicPerCapitaPps.why` | Μετρά τα αγαθά και τις υπηρεσίες που χρησιμοποιούν πράγματι τα νοικοκυριά, μαζί με όσα πληρώνει το κράτος, όπως η υγεία και η παιδεία, γι' αυτό δείχνει το βιοτικό επίπεδο καλύτερα από το ΑΕΠ. | It counts the goods and services households actually use, including those the state pays for, such as health and education, so it reflects living standards better than GDP. | pending (new in M6) |
| `peers.aicPerCapitaPps.takeaway` | Η κατανάλωση ανά κάτοικο στην Ελλάδα βρίσκεται {gap} μέσο όρο της ΕΕ-27· {rankClause}. | Consumption per person in Greece is {gap} the EU-27 average; {rankClause}. | pending (new in M6) |
| `peers.netEarningsPps.title` | Καθαρές ετήσιες αποδοχές | Annual net earnings | pending (new in M6) |
| `peers.netEarningsPps.unit` | ΜΑΔ τον χρόνο· άγαμος χωρίς παιδιά, με τον μέσο μισθό | PPS a year; single person, no children, on the average wage | pending (new in M6) |
| `peers.netEarningsPps.takeaway` | Οι καθαρές αποδοχές αυτού του νοικοκυριού στην Ελλάδα βρίσκονται {gap} μέσο όρο της ΕΕ-27· {rankClause}. | Net earnings for this household in Greece are {gap} the EU-27 average; {rankClause}. | pending (new in M6) |
| `peers.priceLevelIndex.title` | Επίπεδο τιμών | Price level | pending (new in M6) |
| `peers.priceLevelIndex.unit` | Δείκτης, ΕΕ-27 = 100 (πραγματική ατομική κατανάλωση) | Index, EU-27 = 100 (actual individual consumption) | pending (new in M6) |
| `peers.priceLevelIndex.takeaway` | Οι τιμές στην Ελλάδα βρίσκονται {gap} μέσο όρο της ΕΕ-27· {rankClause}. | Prices in Greece are {gap} the EU-27 average; {rankClause}. | pending (new in M6) |
| `peers.housingCostOverburden.title` | Επιβάρυνση από το κόστος στέγασης | Housing cost overburden | pending (new in M6) |
| `peers.housingCostOverburden.unit` | % του πληθυσμού που ζει σε νοικοκυριά τα οποία ξοδεύουν πάνω από το 40% του διαθέσιμου εισοδήματός τους για στέγαση | % of people living in households that spend more than 40% of their disposable income on housing | pending (new in M6) |
| `peers.housingCostOverburden.takeaway` | Το ποσοστό στην Ελλάδα βρίσκεται {gap} μέσο όρο της ΕΕ-27· {rankClause}. | The share in Greece is {gap} the EU-27 average; {rankClause}. | pending (new in M6) |
| `peers.minimumWagePps.title` | Κατώτατος μισθός | Minimum wage | pending (new in M6) |
| `peers.minimumWagePps.unit` | ΜΑΔ τον μήνα | PPS a month | pending (new in M6) |
| `peers.minimumWagePps.takeaway` | Σε όρους αγοραστικής δύναμης, {rankClause}. | In purchasing-power terms, {rankClause}. | pending (new in M6) |
| `peers.minimumWagePps.note` | Η Ιταλία δεν έχει νομοθετημένο κατώτατο μισθό, και δεν υπάρχει στοιχείο για το σύνολο της ΕΕ. | Italy has no statutory minimum wage, and there is no EU-wide figure. | pending (new in M6) |
| `nav.main` | Κύριο μενού | Main menu | pending (new in M7) |
| `nav.calculator` | Υπολογιστής | Calculator | pending (new in M7) |
| `nav.compare` | Σύγκριση | Comparison | pending (new in M7) |
| `nav.methodology` | Μεθοδολογία | Methodology | pending (new in M7) |
| `footer.privacy` | Απόρρητο | Privacy | pending (new in M7) |
| `footer.about` | Σχετικά | About | pending (new in M7) |
| `meta.calculator.description` | Υπολόγισε τι θα σου έμενε κάθε μήνα στην Ελλάδα μετά το ενοίκιο, με και χωρίς την απαλλαγή του άρθρου 5Γ. | Work out what you'd have left each month in Greece after rent, with and without the Article 5C tax break. | pending (new in M7) |
| `meta.compare.description` | Η Ελλάδα σε σύγκριση με Βουλγαρία, Ρουμανία, Πορτογαλία, Ισπανία, Ιταλία και τον μέσο όρο της ΕΕ, με στοιχεία της Eurostat. | Greece compared with Bulgaria, Romania, Portugal, Spain, Italy and the EU average, using Eurostat data. | pending (new in M7) |
| `meta.methodology.description` | Πώς υπολογίζουμε τον καθαρό μισθό, το ενοίκιο και την αγοραστική δύναμη, οι πηγές μας και οι περιορισμοί. | How we calculate net pay, rent and purchasing power, our sources and our limitations. | pending (new in M7) |
| `meta.privacy.description` | Τι γίνεται με τα στοιχεία σου: τίποτα δεν αποθηκεύεται και δεν υπάρχουν cookies. | What happens to your data: nothing is stored, and there are no cookies. | pending (new in M7) |
| `meta.about.description` | Ποιος φτιάχνει το Nostos και γιατί. Δεν είναι φορολογική συμβουλή. | Who makes Nostos and why. Not tax advice. | pending (new in M7) |
| `home.hook` | Θα ήσουν οικονομικά καλύτερα ή χειρότερα στην Ελλάδα; | Would you be better or worse off in Greece? | pending (new in M7) |
| `home.pitch` | Σύγκρινε τι θα σου έμενε κάθε μήνα στην Ελλάδα μετά το ενοίκιο με όσα σου μένουν σήμερα, σε πραγματική αγοραστική δύναμη, με και χωρίς την απαλλαγή του άρθρου 5Γ. | Compare what you'd have left each month in Greece after rent with what you have now, in real purchasing power, with and without the Article 5C tax break. | pending (new in M7) |
| `home.cta` | Ξεκίνα τον υπολογισμό | Start the calculator | pending (new in M7) |
| `home.ctaNote` | Περίπου 3 λεπτά. Ό,τι συμπληρώνεις δεν φεύγει από τη συσκευή σου. | About 3 minutes. Nothing you enter leaves your device. | pending (new in M7) |
| `home.stats.title` | Η Ελλάδα σε αριθμούς | Greece in numbers | pending (new in M7) |
| `home.stats.intro` | Σε σύγκριση με τον μέσο όρο της ΕΕ-27, με τα πιο πρόσφατα στοιχεία της Eurostat. | Compared with the EU-27 average, using the latest Eurostat figures. | pending (new in M7) |
| `home.stat.vsEu` | {gap} μέσο όρο της ΕΕ-27 ({eu}) | {gap} the EU-27 average ({eu}) | pending (new in M7) |
| `home.stat.source` | Eurostat, {dataset} · {year} | Eurostat, {dataset} · {year} | pending (new in M7) |
| `home.stats.more` | Δες ολόκληρη τη σύγκριση με Βουλγαρία, Ρουμανία, Πορτογαλία, Ισπανία και Ιταλία | See the full comparison with Bulgaria, Romania, Portugal, Spain and Italy | pending (new in M7) |
| `home.trust` | Κάθε αριθμός έχει πηγή, και κάθε εκτίμηση αναφέρεται ως εκτίμηση. | Every figure has a source, and every estimate is labelled as one. | pending (new in M7) |
| `home.trustLink` | Δες πώς υπολογίζουμε | See how we calculate | pending (new in M7) |
| `method.title` | Μεθοδολογία και πηγές | Methodology and sources | pending (new in M7) |
| `method.intro` | Πώς δουλεύουν ο υπολογιστής και η σύγκριση: κάθε τύπος, κάθε πηγή δεδομένων και τα όρια όσων μπορούμε να εκτιμήσουμε. | How the calculator and the comparison work: every formula, every data source, and the limits of what we can estimate. | pending (new in M7) |
| `method.toc` | Σε αυτή τη σελίδα | On this page | pending (new in M7) |
| `method.notVerified` | δεν έχει επαληθευτεί ακόμα | not yet verified | pending (new in M7) |
| `method.verifiedOn` | επαληθεύτηκε {date} | verified {date} | pending (new in M7) |
| `method.notSet` | δεν έχει οριστεί ακόμα | not set yet | pending (new in M7) |
| `method.formulas.title` | Πώς υπολογίζουμε | How the calculator works | pending (new in M7) |
| `method.net.title` | Καθαρός μισθός στην Ελλάδα | Greek net pay | pending (new in M7) |
| `method.net.intro` | Ξεκινάμε από τον μικτό ετήσιο μισθό που συμπληρώνεις: | We start from the gross annual salary you enter: | pending (new in M7) |
| `method.net.step1` | Ασφαλιστικές εισφορές εργαζομένου (e-ΕΦΚΑ) = μικτές αποδοχές × το ποσοστό εισφορών του εργαζομένου. Υπολογίζονται μόνο μέχρι ένα μηνιαίο ανώτατο όριο αποδοχών. | Employee social contributions (EFKA) = gross pay × the employee contribution rate. They are charged only on pay up to a monthly ceiling. | pending (new in M7) |
| `method.net.step2` | Φορολογητέο εισόδημα = μικτές αποδοχές − εισφορές εργαζομένου. | Taxable income = gross pay − employee contributions. | pending (new in M7) |
| `method.net.step3` | Φόρος εισοδήματος: το φορολογητέο εισόδημα φορολογείται κλιμάκιο προς κλιμάκιο με τους συντελεστές του 2026. Οι συντελεστές εξαρτώνται από τον αριθμό των εξαρτώμενων τέκνων, και έως τα 30 ισχύουν χαμηλότεροι συντελεστές. | Income tax: taxable income is taxed band by band at the 2026 rates. The rates depend on how many dependent children you have, and lower rates apply up to age 30. | pending (new in M7) |
| `method.net.step4` | Μείωση φόρου: ένα σταθερό ποσό, ανάλογα με τον αριθμό των τέκνων, αφαιρείται από τον φόρο. Πάνω από ένα όριο εισοδήματος, το ποσό μικραίνει όσο αυξάνεται το εισόδημα. | Tax reduction: a fixed amount, depending on the number of children, is taken off the tax. Above an income threshold it shrinks as income rises. | pending (new in M7) |
| `method.net.step5` | Άλλες επιβαρύνσεις, όπως η ειδική εισφορά αλληλεγγύης, προστίθενται μόνο αν ισχύουν για εισόδημα από μισθωτή εργασία το 2026. | Other levies, such as the special solidarity contribution, are added only if they apply to employment income in 2026. | pending (new in M7) |
| `method.net.step6` | Ετήσιες καθαρές αποδοχές = μικτές αποδοχές − εισφορές − τελικός φόρος − άλλες επιβαρύνσεις. | Annual net pay = gross pay − contributions − final tax − other levies. | pending (new in M7) |
| `method.net.step7` | Μηνιαίες καθαρές αποδοχές = ετήσιες καθαρές ÷ 12. Στην Ελλάδα ο μισθός συνήθως καταβάλλεται σε 14 δόσεις (μαζί με τα δώρα Χριστουγέννων και Πάσχα και το επίδομα αδείας), οπότε κάθε πραγματική καταβολή είναι οι ετήσιες καθαρές ÷ 14. | Monthly net pay = annual net ÷ 12. Greek salaries are usually paid in 14 instalments (including the Christmas, Easter and holiday bonuses), so each actual payment is annual net ÷ 14. | pending (new in M7) |
| `method.net.params` | Οι ακριβείς συντελεστές, τα κλιμάκια και τα όρια βρίσκονται στη λίστα φορολογικών παραμέτρων παρακάτω, η καθεμία με την πηγή της. | The exact rates, bands and thresholds are in the list of tax parameters below, each with its source. | pending (new in M7) |
| `method.fiveCCalc.title` | Με την απαλλαγή του άρθρου 5Γ | With the Article 5C break | pending (new in M7) |
| `method.fiveCCalc.body` | Με την απαλλαγή, μέρος του εισοδήματός σου δεν φορολογείται, οπότε ο φόρος στα βήματα 3–5 είναι μικρότερος. Η απαλλαγή διαρκεί ορισμένο αριθμό ετών· μετά, ο υπολογιστής δείχνει τον μισθό σου χωρίς αυτήν. Αυτή η πτώση είναι το «σκαλοπάτι» στο διάγραμμα. | With the break, part of your income is not taxed, so the tax in steps 3–5 is lower. The break lasts a set number of years; after that, the calculator shows your pay without it. That drop is the "cliff" in the timeline chart. | pending (new in M7) |
| `method.fiveCCalc.open` | Πώς ακριβώς εφαρμόζεται η απαλλαγή (στο εισόδημα ή στον φόρο, και με ποια σειρά σε σχέση με τη μείωση φόρου) επαληθεύεται ακόμα. Ο υπολογιστής ακολουθεί τον κανόνα που είναι καταγεγραμμένος στις φορολογικές παραμέτρους. | Exactly how the break is applied (to the income or to the tax, and in what order relative to the tax reduction) is still being verified. The calculator follows the rule recorded in the tax parameters. | pending (new in M7) |
| `method.rent.title` | Ενοίκιο στην Ελλάδα | Rent in Greece | pending (new in M7) |
| `method.rent.body` | Εκτιμώμενο ενοίκιο = μέση ζητούμενη τιμή ενοικίου στην πόλη (€ ανά τ.μ. τον μήνα, από τη Spitogatos) × το εμβαδόν του διαμερίσματος σε τ.μ. | Estimated rent = average asking rent in the city (€ per m² per month, from Spitogatos) × the apartment size in m². | pending (new in M7) |
| `method.rent.sizes` | Εμβαδά που χρησιμοποιούμε: | Apartment sizes we use: | pending (new in M7) |
| `method.left.title` | Τι μένει μετά το ενοίκιο | Left after rent | pending (new in M7) |
| `method.left.body` | Υπόλοιπο μετά το ενοίκιο = μηνιαίες καθαρές αποδοχές − μηνιαίο ενοίκιο, στην Ελλάδα και στη χώρα όπου ζεις τώρα. Για τη χώρα σου χρησιμοποιούμε τις καθαρές αποδοχές και το ενοίκιο που συμπληρώνεις· δεν υπολογίζουμε ξένους φόρους. | Left after rent = monthly net pay − monthly rent, in Greece and in the country where you live now. For your current country we use the net pay and rent you enter; we don't calculate foreign taxes. | pending (new in M7) |
| `method.fx.title` | Νόμισμα | Currency | pending (new in M7) |
| `method.fx.body` | Ποσά σε λίρες, δολάρια ή κορόνες μετατρέπονται σε ευρώ με την πιο πρόσφατη ισοτιμία αναφοράς της ΕΚΤ: ποσό σε ευρώ = ποσό ÷ μονάδες του νομίσματος ανά 1 €. | Amounts in pounds, dollars or kronor are converted to euros at the latest ECB euro reference rate: amount in EUR = amount ÷ units of that currency per €1. | pending (new in M7) |
| `method.ppp.title` | Αγοραστική δύναμη | Purchasing power | pending (new in M7) |
| `method.ppp.body` | Το ίδιο ευρώ αγοράζει διαφορετικά πράγματα σε κάθε χώρα. Για να συγκρίνουμε ισότιμα, εκφράζουμε το υπόλοιπο στη χώρα σου σε τιμές Ελλάδας: ποσό σε τιμές Ελλάδας = ποσό σε ευρώ × επίπεδο τιμών Ελλάδας ÷ επίπεδο τιμών της χώρας σου. Τα επίπεδα τιμών είναι οι δείκτες επιπέδου τιμών του ΟΟΣΑ για την πραγματική ατομική κατανάλωση. | The same euro buys different amounts in different countries. To compare like with like, we express what's left in your current country in Greek prices: amount in Greek prices = amount in EUR × Greek price level ÷ your country's price level. Price levels are OECD price level indices for actual individual consumption. | pending (new in M7) |
| `method.ppp.example` | Παράδειγμα: αν οι τιμές στη χώρα σου είναι 40% υψηλότερες από ό,τι στην Ελλάδα, 1.400 € που σου μένουν εκεί αντιστοιχούν σε περίπου 1.000 € σε τιμές Ελλάδας. | Example: if prices in your country are 40% higher than in Greece, €1,400 left over there is worth about €1,000 in Greek prices. | pending (new in M7) |
| `method.headline.title` | Το ποσοστό της σύνοψης | The headline percentage | pending (new in M7) |
| `method.headline.body` | Διαφορά = (υπόλοιπο στην Ελλάδα − υπόλοιπο στη χώρα σου σε τιμές Ελλάδας) ÷ υπόλοιπο στη χώρα σου σε τιμές Ελλάδας × 100, στρογγυλεμένο σε ακέραιο. Κάτω από 1% προς οποιαδήποτε κατεύθυνση εμφανίζεται ως «περίπου το ίδιο». Υπολογίζεται χωριστά για τα χρόνια με την απαλλαγή του άρθρου 5Γ και για τα χρόνια μετά. | Difference = (left in Greece − left in your country in Greek prices) ÷ left in your country in Greek prices × 100, rounded to a whole percent. Under 1% either way reads as "about the same". It is worked out separately for the years with the Article 5C break and the years after. | pending (new in M7) |
| `method.peers.title` | Σελίδα σύγκρισης | The comparison page | pending (new in M7) |
| `method.peers.body` | Έξι δείκτες της Eurostat, ο καθένας για την πιο πρόσφατη περίοδο για την οποία υπάρχουν στοιχεία για όλες τις χώρες. Η σύντομη πρόταση πάνω από κάθε διάγραμμα δημιουργείται από τα στοιχεία: η απόσταση της Ελλάδας από τον μέσο όρο της ΕΕ-27 και η θέση της ανάμεσα στις χώρες. | Six Eurostat indicators, each for the latest period in which every country shown has a figure. The short sentence above each chart is generated from the data: Greece's gap to the EU-27 average and its rank among the countries shown. | pending (new in M7) |
| `method.fiveC.title` | Άρθρο 5Γ: η απαλλαγή 50% | Article 5C: the 50% tax break | pending (new in M7) |
| `method.fiveC.what` | Αν μεταφέρεις τη φορολογική σου κατοικία στην Ελλάδα και εργάζεσαι εδώ, το άρθρο 5Γ του Κώδικα Φορολογίας Εισοδήματος (ΚΦΕ) απαλλάσσει από τον φόρο εισοδήματος το {rate} του εισοδήματός σου από εργασία, για {years} χρόνια. | If you move your tax residence to Greece and work here, Article 5C of the Greek Income Tax Code exempts {rate} of your income from work from income tax, for {years} years. | pending (new in M7) |
| `method.fiveC.what.generic` | Αν μεταφέρεις τη φορολογική σου κατοικία στην Ελλάδα και εργάζεσαι εδώ, το άρθρο 5Γ του Κώδικα Φορολογίας Εισοδήματος (ΚΦΕ) απαλλάσσει από τον φόρο εισοδήματος το 50% του εισοδήματός σου από εργασία, για περιορισμένο αριθμό ετών. Το ακριβές ποσοστό και η διάρκεια δεν έχουν επαληθευτεί ακόμα με βάση τις οδηγίες της ΑΑΔΕ. | If you move your tax residence to Greece and work here, Article 5C of the Greek Income Tax Code exempts 50% of your income from work from income tax, for a limited number of years. The exact rate and duration have not yet been verified against AADE guidance. | pending (new in M7) |
| `method.fiveC.conditions` | Οι βασικές προϋποθέσεις, όπως τις ελέγχουμε στο κουίζ: | The main conditions, as the quiz checks them: | pending (new in M7) |
| `method.fiveC.outcomes` | Το κουίζ δεν λέει ποτέ ότι πληροίς τις προϋποθέσεις. Δίνει ένα από τρία αποτελέσματα: «Πιθανότατα πληροίς τις προϋποθέσεις», «Οριακή περίπτωση» ή «Πιθανότατα δεν πληροίς τις προϋποθέσεις». Μόνο η ΑΑΔΕ αποφασίζει. | The quiz never tells you that you qualify. It gives one of three outcomes: "Likely eligible", "Borderline" or "Likely not eligible". Only AADE decides. | pending (new in M7) |
| `method.fiveC.rules` | Οι κανόνες του άρθρου 5Γ και οι πηγές τους | Article 5C rules and their sources | pending (new in M7) |
| `method.fiveC.official` | Επίσημη ενημέρωση: ΑΑΔΕ, συχνές ερωτήσεις για το άρθρο 5Γ ΚΦΕ (Οκτώβριος 2025) | Official guidance: AADE, frequently asked questions on Article 5C (October 2025, in Greek) | pending (new in M7) |
| `method.params.col.param` | Παράμετρος | Parameter | pending (new in M7) |
| `method.params.col.status` | Κατάσταση | Status | pending (new in M7) |
| `method.params.col.source` | Πηγή | Source | pending (new in M7) |
| `method.params.source` | πηγή | source | pending (new in M7) |
| `method.params.all` | Όλες οι φορολογικές παράμετροι ({verified} από {total} επαληθευμένες) | All tax parameters ({verified} of {total} verified) | pending (new in M7) |
| `method.sources.title` | Πηγές δεδομένων | Data sources | pending (new in M7) |
| `method.sources.col.data` | Στοιχεία | Data | pending (new in M7) |
| `method.sources.col.source` | Πηγή | Source | pending (new in M7) |
| `method.sources.col.period` | Περίοδος στοιχείων | Data period | pending (new in M7) |
| `method.sources.col.updated` | Τελευταία ενημέρωση | Last updated | pending (new in M7) |
| `method.src.fx` | Συναλλαγματικές ισοτιμίες | Exchange rates | pending (new in M7) |
| `method.src.priceLevels` | Επίπεδα τιμών (υπολογιστής) | Price levels (calculator) | pending (new in M7) |
| `method.src.rent` | Ενοίκια ανά τ.μ. (Αθήνα, Θεσσαλονίκη, Ηράκλειο, Πάτρα) | Rent per m² (Athens, Thessaloniki, Heraklion, Patras) | pending (new in M7) |
| `method.src.rent.provider` | Spitogatos, Spitogatos Property Index | Spitogatos, Spitogatos Property Index | pending (new in M7) |
| `method.src.rent.missing` | δεν έχουν καταχωριστεί ακόμα | not entered yet | pending (new in M7) |
| `method.src.rent.manual` | καταχωρίζεται με το χέρι κάθε τρίμηνο | entered by hand each quarter | pending (new in M7) |
| `method.src.tax` | Φορολογικοί κανόνες 2026 | Greek tax rules for 2026 | pending (new in M7) |
| `method.src.tax.provider` | ΑΑΔΕ και νομοθεσία (μία πηγή ανά παράμετρο) | AADE and legislation (one source per parameter) | pending (new in M7) |
| `method.src.tax.pending` | {count} από {total} δεν έχουν επαληθευτεί ακόμα | {count} of {total} not yet verified | pending (new in M7) |
| `method.sources.cadence` | Οι ισοτιμίες ανανεώνονται κάθε εργάσιμη μέρα, τα στοιχεία ΟΟΣΑ και Eurostat ελέγχονται κάθε μήνα, τα ενοίκια καταχωρίζονται με το χέρι κάθε τρίμηνο και οι φορολογικοί κανόνες ελέγχονται μία φορά τον χρόνο. | Exchange rates are refreshed every working day, OECD and Eurostat data are checked monthly, rents are entered by hand each quarter, and tax rules are checked once a year. | pending (new in M7) |
| `method.sources.licence` | Πηγές: ΕΚΤ, ΟΟΣΑ, Eurostat, Spitogatos. Τα στοιχεία χρησιμοποιούνται σύμφωνα με τους όρους τους, με αναφορά της πηγής. | Sources: ECB, OECD, Eurostat, Spitogatos. Data are reused under their terms, with attribution. | pending (new in M7) |
| `method.limits.title` | Γνωστοί περιορισμοί | Known limitations | pending (new in M7) |
| `method.limit.housing.title` | Η στέγαση μετριέται εν μέρει δύο φορές | Housing is partly counted twice | pending (new in M7) |
| `method.limit.housing.body` | Ο δείκτης επιπέδου τιμών καλύπτει όλη την κατανάλωση των νοικοκυριών, μαζί με τη στέγαση, και εμείς αφαιρούμε επιπλέον το ενοίκιο χωριστά. Δεν υπάρχει δημοσιευμένος δείκτης χωρίς τη στέγαση για όλες τις χώρες που καλύπτουμε, οπότε δεχόμαστε αυτή την επικάλυψη. Μπορεί να αλλοιώνει λίγο τη σύγκριση. | The price level index covers all household consumption, housing included, and we also subtract rent separately. No published index excludes housing for all the countries we cover, so we accept this overlap. It can skew the comparison slightly. | pending (new in M7) |
| `method.limit.asking.title` | Ζητούμενα, όχι συμφωνημένα ενοίκια | Asking rents, not signed rents | pending (new in M7) |
| `method.limit.asking.body` | Τα στοιχεία της Spitogatos είναι μέσοι όροι τιμών αγγελιών. Τα ενοίκια που τελικά συμφωνούνται είναι συχνά χαμηλότερα. | Spitogatos figures are averages of advertised prices. The rents people actually sign for are often lower. | pending (new in M7) |
| `method.limit.oneEarner.title` | Ένας εργαζόμενος | One earner | pending (new in M7) |
| `method.limit.oneEarner.body` | Υπολογίζουμε με τον μισθό ενός ατόμου. Δεύτερο εισόδημα στο νοικοκυριό δεν λαμβάνεται υπόψη, και θεωρούμε ότι το ενοίκιο το πληρώνεις ολόκληρο εσύ. | We calculate with one person's salary. A second household income isn't included, and we assume you pay the full rent yourself. | pending (new in M7) |
| `method.limit.rules.title` | Οι κανόνες του 2026 για όλα τα χρόνια | 2026 rules for every year | pending (new in M7) |
| `method.limit.rules.body` | Το διάγραμμα εφαρμόζει τους φορολογικούς κανόνες του 2026 σε όλα τα χρόνια. Οι συντελεστές και τα όρια θα αλλάξουν, αλλά δεν προσπαθούμε να μαντέψουμε πώς. Μισθοί, ενοίκια και τιμές μένουν επίσης στα σημερινά επίπεδα. | The timeline applies the 2026 tax rules to every year. Rates and thresholds will change, but we don't try to guess how. Pay, rents and prices also stay at today's levels. | pending (new in M7) |
| `method.limit.age.title` | Πώς μετράμε την ηλικία | How age is counted | pending (new in M7) |
| `method.limit.age.body` | Έως τα 30 ισχύουν χαμηλότεροι φορολογικοί συντελεστές. Υπολογίζουμε την ηλικιακή σου ομάδα για κάθε χρόνο από το έτος γέννησής σου. Ο ακριβής κανόνας (η ηλικία που συμπληρώνεις μέσα στο έτος ή η ηλικία την 1η Ιανουαρίου) επαληθεύεται ακόμα· όπου οι δύο κανόνες δίνουν διαφορετικό αποτέλεσμα, το λέμε. | Lower tax rates apply up to age 30. We work out your age band for each year from your year of birth. The exact rule (the age you reach during the year, or your age on 1 January) is still being verified; where the two rules give different results, we say so. | pending (new in M7) |
| `method.limit.remote.title` | Η εξ αποστάσεως εργασία είναι γκρίζα ζώνη | Remote work is a grey area | pending (new in M7) |
| `method.limit.remote.body` | Αν θα εργάζεσαι εξ αποστάσεως για ξένη εταιρεία χωρίς παρουσία στην Ελλάδα, δεν είναι ξεκάθαρο αν ισχύει το άρθρο 5Γ. Το κουίζ το χαρακτηρίζει οριακή περίπτωση. Ζήτησε επιβεβαίωση από Έλληνα φοροτεχνικό πριν βασιστείς στην απαλλαγή 50%. | If you'd work remotely for a foreign company with no presence in Greece, it isn't clear whether Article 5C applies. The quiz marks this as borderline. Get confirmation from a Greek tax adviser before relying on the 50% break. | pending (new in M7) |
| `privacy.title` | Απόρρητο | Privacy | pending (new in M7) |
| `privacy.intro` | Με λίγα λόγια: τίποτα από όσα συμπληρώνεις δεν αποθηκεύεται ούτε στέλνεται πουθενά, και ο ιστότοπος δεν χρησιμοποιεί cookies. | In short: nothing you enter is stored or sent anywhere, and the site uses no cookies. | pending (new in M7) |
| `privacy.inputs.title` | Τι συμπληρώνεις στον υπολογιστή | What you enter in the calculator | pending (new in M7) |
| `privacy.inputs.body` | Οι απαντήσεις σου στο κουίζ και τα ποσά που συμπληρώνεις επεξεργάζονται μέσα στον browser σου, στη συσκευή σου. Δεν στέλνονται σε εμάς ούτε σε κανέναν άλλο και δεν αποθηκεύονται: αν κλείσεις ή ανανεώσεις τη σελίδα, χάνονται. | Your quiz answers and the figures you enter are processed in your browser, on your device. They are not sent to us or to anyone else, and they are not saved: close or reload the page and they're gone. | pending (new in M7) |
| `privacy.cookies.title` | Cookies | Cookies | pending (new in M7) |
| `privacy.cookies.body` | Ο ιστότοπος δεν ορίζει cookies και δεν αποθηκεύει τίποτα στη συσκευή σου. Γι' αυτό δεν θα δεις μήνυμα για cookies. | The site sets no cookies and stores nothing on your device. That's why there's no cookie banner. | pending (new in M7) |
| `privacy.analytics.title` | Στατιστικά επισκεψιμότητας | Visitor statistics | pending (new in M7) |
| `privacy.analytics.body` | Μετράμε τις επισκέψεις με το {provider}. Δεν χρησιμοποιεί cookies και δεν βλέπει ποτέ όσα συμπληρώνεις στον υπολογιστή. | We count visits with {provider}. It uses no cookies and never sees what you enter in the calculator. | pending (new in M7) |
| `privacy.analytics.none` | Δεν χρησιμοποιούμε κανένα εργαλείο στατιστικών επισκεψιμότητας. | We don't use any visitor statistics tool. | pending (new in M7) |
| `privacy.policyLink` | Πολιτική απορρήτου: {provider} | {provider} privacy policy | pending (new in M7) |
| `privacy.hosting.title` | Φιλοξενία | Hosting | pending (new in M7) |
| `privacy.hosting.body` | Τις σελίδες τις σερβίρει η Cloudflare. Όπως κάθε πάροχος φιλοξενίας, επεξεργάζεται τη διεύθυνση IP σου για να σου στείλει τις σελίδες και να προστατεύσει τον ιστότοπο από κακόβουλη χρήση. Εμείς δεν κρατάμε αρχεία καταγραφής. | The pages are served by Cloudflare. Like any web host, it processes your IP address to deliver the pages and to protect the site from abuse. We don't keep any logs. | pending (new in M7) |
| `about.title` | Σχετικά | About | pending (new in M7) |
| `about.name` | Νόστος: η επιστροφή στην πατρίδα. | Nostos (νόστος) is Greek for homecoming. | pending (new in M7) |
| `about.who.title` | Ποιος το φτιάχνει | Who makes it | pending (new in M7) |
| `about.who.body` | Το Nostos είναι ανεξάρτητο εγχείρημα. Δεν συνδέεται με κανέναν δημόσιο φορέα, καμία εταιρεία και κανέναν φοροτεχνικό. | Nostos is an independent project. It isn't affiliated with any public body, company or tax adviser. | pending (new in M7) |
| `about.why.title` | Γιατί | Why | pending (new in M7) |
| `about.why.body` | Πολλοί από όσους έφυγαν από την Ελλάδα τα χρόνια της κρίσης, αλλά και πολλοί που δεν έχουν ζήσει ποτέ εδώ, σκέφτονται να έρθουν. Οι αριθμοί που χρειάζονται είναι σκόρπιοι σε νόμους, στατιστικές και αγγελίες. Το Nostos τους μαζεύει σε ένα σημείο, με τις πηγές τους, για να κρίνεις εσύ. | Many people who left Greece during the crisis years, and many who have never lived here, are thinking about moving. The numbers they need are scattered across tax law, statistics and listings. Nostos brings them together, with their sources, so you can judge for yourself. | pending (new in M7) |
| `about.disclaimer.title` | Δεν είναι φορολογική συμβουλή | Not tax advice | pending (new in M7) |
| `about.disclaimer.body1` | Όλα όσα βλέπεις εδώ είναι εκτιμήσεις με βάση δημοσιευμένα στοιχεία και τους κανόνες όπως τους καταλαβαίνουμε. Οι φορολογικοί κανόνες αλλάζουν, και η κατάσταση του καθενός είναι διαφορετική. | Everything here is an estimate based on published figures and the rules as we understand them. Tax rules change, and individual circumstances differ. | pending (new in M7) |
| `about.disclaimer.body2` | Τίποτα σε αυτόν τον ιστότοπο δεν αποτελεί φορολογική, νομική ή χρηματοοικονομική συμβουλή. Μόνο η ΑΑΔΕ αποφασίζει αν πληροίς τις προϋποθέσεις του άρθρου 5Γ. Επιβεβαίωσε με Έλληνα φοροτεχνικό πριν πάρεις αποφάσεις. | Nothing on this site is tax, legal or financial advice. Only AADE decides whether you qualify for Article 5C. Confirm with a Greek tax adviser before making decisions. | pending (new in M7) |
| `about.method` | Πώς υπολογίζουμε και από πού προέρχονται τα στοιχεία | How we calculate, and where the data comes from | pending (new in M7) |
| `placeholder.analytics` | [εργαλείο στατιστικών: θα επιβεβαιωθεί] | [analytics provider: to be confirmed] | pending (new in M7) |
| `home.stat.housingCostOverburden.unit` | του πληθυσμού ζει σε νοικοκυριά που ξοδεύουν πάνω από το 40% του διαθέσιμου εισοδήματός τους για στέγαση | of people live in households that spend more than 40% of their disposable income on housing | pending (new in M7) |

Not listed (not Greek text, or identical in both languages): `site.name`, `lang.el.short`, `lang.en.short`, `lang.en.name`, `calc.ageBand.26to30`, `calc.ageBand.31plus`, `calc.email.label`, `peers.plainYear`.

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
- **Greece vs peers (M6):**
  - **Generated takeaways:** each takeaway is assembled from `peers.<indicator>.takeaway` + `peers.gap.*` + `peers.rankClause` + `peers.rank.*`, with numbers from the data. Current Greek output, for example: «Το ΑΕΠ ανά κάτοικο στην Ελλάδα βρίσκεται 32% κάτω από τον μέσο όρο της ΕΕ-27· η Ελλάδα έχει τη δεύτερη χαμηλότερη τιμή ανάμεσα στις 6 χώρες.»
  - **Phrasing:** "κάτω/πάνω από τον μέσο όρο" was chosen because it needs no gender agreement with the subject.
  - **ΜΑΔ** (Μονάδες Αγοραστικής Δύναμης) is Eurostat's Greek term for PPS.
- **Content pages (M7):**
  - **Also listed now:** the navigation, footer and meta-description strings added at the start of M7 (`nav.*`, `footer.privacy`, `footer.about`, `meta.*.description`) were missing from this list.
  - **Placeholders:** `{gap}` in `home.stat.vsEu` is a `peers.gap.*` phrase (e.g. «19% κάτω από τον»), so the tile reads «19% κάτω από τον μέσο όρο της ΕΕ-27 (26.300)». `{provider}` and `{email}` come from `src/config/site.json`. Until those are set, the page shows the `placeholder.*` text in a highlighted box.
  - **"browser":** kept in English in `privacy.inputs.body` («μέσα στον browser σου»), as most people say it. The alternative is «πρόγραμμα περιήγησης».
  - **Gender:** «για να κρίνεις εσύ» was used instead of «μόνος σου» to stay gender-neutral. «Έλληνα φοροτεχνικό» uses the generic masculine.
  - **"50%":** `method.fiveC.title`, `method.fiveC.what.generic` and `method.limit.remote.body` state 50%, as requested. See open item 29.
  - **OG images** (`public/og/*.png`) use `home.hook` + `home.pitch` for the home page and `<page title>` + `meta.<page>.description` for the rest, plus `footer.disclaimer`. If you change any of these, run `npm run og`.
