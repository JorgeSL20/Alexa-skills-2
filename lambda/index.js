const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Datos de hechos sobre el espacio en diferentes idiomas
const data = {
    'es': [
        "La Luna se está alejando de la Tierra: Cada año, la Luna se aleja de la Tierra unos 3.8 cm.",
        "Un día en Venus es más largo que un año en Venus.",
        "La estrella más grande conocida es UY Scuti, con un radio 1700 veces mayor que el del Sol.",
        "En Júpiter y Saturno, se cree que llueve diamantes.",
        "Se estima que el universo tiene más de 93 mil millones de años luz de diámetro.",
        "La tormenta más grande del sistema solar es la Gran Mancha Roja de Júpiter.",
        "Se estima que hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.",
        "El espacio contiene partículas de gas y polvo, aunque en cantidades muy pequeñas."
    ],
    'en': [
        "The Moon is drifting away from Earth: Each year, the Moon moves about 3.8 cm away from Earth.",
        "A day on Venus is longer than a year on Venus.",
        "The largest known star is UY Scuti, with a radius 1700 times that of the Sun.",
        "On Jupiter and Saturn, it is believed that it rains diamonds.",
        "The universe is estimated to be over 93 billion light-years in diameter.",
        "The largest storm in the solar system is Jupiter's Great Red Spot.",
        "There are estimated to be more stars in the universe than grains of sand on all the Earth's beaches.",
        "Space contains particles of gas and dust, although in very small amounts."
    ]
};

// Configuración de mensajes en diferentes idiomas
const languageStrings = {
    'en': {
        translation: {
            WELCOME_MESSAGE: 'Welcome, you can ask me for a fun fact about space. What would you like to know?',
            HELP_MESSAGE: 'You can ask me for a fun fact about space by saying, give me a fun fact.',
            GOODBYE_MESSAGE: 'Goodbye!',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, I had trouble doing what you asked. Please try again.',
            REPROMPT_MESSAGE: 'How else can I help you?',
            FACT_REPROMPT: 'Would you like to know another fact?'
        }
    },
    'es': {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido, puedes pedirme un dato curioso sobre el espacio. ¿Qué te gustaría saber?',
            HELP_MESSAGE: 'Puedes pedirme un dato curioso sobre el espacio diciendo, dame un dato curioso.',
            GOODBYE_MESSAGE: '¡Adiós!',
            FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor intenta nuevamente.',
            ERROR_MESSAGE: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.',
            REPROMPT_MESSAGE: '¿En qué más puedo ayudarte?',
            FACT_REPROMPT: '¿Te gustaría saber algo más?'
        }
    }
};

// Función para determinar el idioma según la configuración regional (locale)
const getLocaleLanguage = (locale) => {
    if (locale.startsWith('es')) {
        return 'es';
    } else if (locale.startsWith('en')) {
        return 'en';
    }
    return 'en'; // Por defecto, fallback a inglés si no se reconoce el idioma
};

// Handlers de las diferentes intenciones
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const MultilenguajeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MultilenguajeIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const language = getLocaleLanguage(locale); // Determina el idioma
        const facts = data[language]; // Obtiene los hechos correspondientes al idioma
        const fact = facts[Math.floor(Math.random() * facts.length)]; // Selecciona un hecho aleatorio

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const repromptOutput = requestAttributes.t('FACT_REPROMPT');

        return handlerInput.responseBuilder
            .speak(fact)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        const repromptOutput = 'Would you like to hear more?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');
        const repromptOutput = requestAttributes.t('REPROMPT_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');
        const repromptOutput = requestAttributes.t('REPROMPT_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        const repromptOutput = requestAttributes.t('REPROMPT_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

// Interceptors para manejar la localización y los logs
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en', // Idioma por defecto en caso de no coincidencia
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings, // Recursos de idioma definidos arriba
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => localizationClient.t(...args);

        // Guardar los atributos actualizados
        handlerInput.attributesManager.setRequestAttributes(attributes);
    }
};

// Configuración del Skill Builder y registro de handlers
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        MultilenguajeIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .lambda();
